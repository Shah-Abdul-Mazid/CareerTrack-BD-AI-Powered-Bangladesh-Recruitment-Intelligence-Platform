"""
CareerTrack BD — Dual Email Dispatcher (Resend API + Standard SMTP).
Dispatches rich 6-digit OTP emails directly to candidate/admin inboxes.
"""

import os
import json
import smtplib
import urllib.request
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

logger = logging.getLogger(__name__)

RESEND_API_KEY = os.getenv("RESEND_API_KEY", "").strip()
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "").strip()
SMTP_PASS = os.getenv("SMTP_PASS", "").strip()
FROM_EMAIL = os.getenv("FROM_EMAIL", "").strip() or SMTP_USER or "onboarding@resend.dev"


def _build_html_template(otp: str, purpose: str) -> str:
    purpose_label = "Account Verification"
    if purpose == "login":
        purpose_label = "Login Security Code"
    elif purpose == "password_reset":
        purpose_label = "Password Reset Code"

    return f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>CareerTrack BD Verification</title>
</head>
<body style="margin:0;padding:24px;background-color:#090714;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#ffffff;">
  <div style="max-width:480px;margin:0 auto;background:#131026;border:1px solid #2e2654;border-radius:20px;padding:36px;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;padding:8px 16px;background:rgba(124,58,237,0.15);border:1px solid rgba(124,58,237,0.3);border-radius:999px;color:#c084fc;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">
        CareerTrack BD
      </div>
      <h2 style="font-size:22px;font-weight:800;color:#ffffff;margin:16px 0 6px 0;">{purpose_label}</h2>
      <p style="font-size:13px;color:#94a3b8;line-height:1.5;margin:0;">Use this 6-digit verification code to complete your security verification. This code expires in 10 minutes.</p>
    </div>

    <div style="background:linear-gradient(135deg,#1f1642 0%,#2c1c5e 100%);border:1px solid #7c3aed;border-radius:16px;padding:22px;text-align:center;margin:24px 0;">
      <span style="font-size:36px;font-weight:900;letter-spacing:10px;color:#38bdf8;font-family:monospace;">{otp}</span>
    </div>

    <p style="font-size:11px;color:#64748b;text-align:center;line-height:1.5;margin-top:20px;">
      If you did not request this verification code, please ignore this email or review your account security.
    </p>

    <div style="margin-top:28px;padding-top:16px;border-top:1px solid #1e1b38;text-align:center;font-size:11px;color:#475569;">
      CareerTrack BD • Bangladesh Recruitment Intelligence & Exam Schedule Platform
    </div>
  </div>
</body>
</html>"""


def send_otp_email(to_email: str, otp: str, purpose: str = "verification") -> dict:
    """
    Sends 6-digit OTP code to any candidate's email address.
    Prioritizes Gmail SMTP (which allows sending to ANY recipient in the world),
    with Resend API as a fallback.
    """
    smtp_user = (os.getenv("SMTP_USER") or os.getenv("GMAIL_APP_EMAIL") or SMTP_USER).strip()
    smtp_pass = (os.getenv("SMTP_PASS") or os.getenv("GMAIL_APP_PASSWORD") or SMTP_PASS).strip()
    resend_key = os.getenv("RESEND_API_KEY", RESEND_API_KEY).strip()

    subject = f"CareerTrack BD OTP: {otp} — Security Verification"
    html_body = _build_html_template(otp, purpose)
    text_body = f"Your CareerTrack BD verification OTP is: {otp}. Valid for 10 minutes."

    # 1. Prefer Gmail SMTP (supports sending to ANY user email address without domain limits)
    if smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"] = f"CareerTrack BD <{smtp_user}>"
            msg["To"] = to_email
            msg.attach(MIMEText(text_body, "plain"))
            msg.attach(MIMEText(html_body, "html"))

            smtp_host = os.getenv("SMTP_HOST", SMTP_HOST).strip()
            smtp_port = int(os.getenv("SMTP_PORT", str(SMTP_PORT)))
            clean_pass = smtp_pass.replace(" ", "")

            # Try SMTP_SSL on 465 first (most reliable on cloud/serverless), fallback to 587 STARTTLS
            try:
                with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
                    server.login(smtp_user, clean_pass)
                    server.sendmail(smtp_user, [to_email], msg.as_string())
                logger.info(f"[Email:SMTP_SSL] Dispatched OTP to {to_email}")
                return {"status": "sent", "provider": "smtp_ssl", "to": to_email}
            except Exception as ssl_err:
                logger.warning(f"[Email:SMTP_SSL] Failed, trying STARTTLS: {ssl_err}")
                with smtplib.SMTP("smtp.gmail.com", 587, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, clean_pass)
                    server.sendmail(smtp_user, [to_email], msg.as_string())
                logger.info(f"[Email:SMTP_STARTTLS] Dispatched OTP to {to_email}")
                return {"status": "sent", "provider": "smtp_starttls", "to": to_email}
        except Exception as e:
            logger.error(f"[Email:SMTP] Failed: {e}")

    # 2. Resend API Fallback
    if resend_key:
        try:
            req_data = json.dumps({
                "from": os.getenv("FROM_EMAIL", "CareerTrack BD <onboarding@resend.dev>"),
                "to": [to_email],
                "subject": subject,
                "html": html_body,
                "text": text_body,
            }).encode("utf-8")

            req = urllib.request.Request(
                "https://api.resend.com/emails",
                data=req_data,
                headers={
                    "Authorization": f"Bearer {resend_key}",
                    "Content-Type": "application/json",
                    "User-Agent": "resend-python/2.0.0",
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                res = json.loads(resp.read().decode("utf-8"))
                logger.info(f"[Email:Resend] Dispatched OTP to {to_email}: ID {res.get('id')}")
                return {"status": "sent", "provider": "resend", "id": res.get("id"), "to": to_email}
        except Exception as e:
            logger.error(f"[Email:Resend] Failed: {e}")

            if smtp_port == 465:
                with smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=10) as server:
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [to_email], msg.as_string())
            else:
                with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_pass)
                    server.sendmail(smtp_user, [to_email], msg.as_string())

            logger.info(f"[Email:SMTP] Dispatched OTP to {to_email}")
            return {"status": "sent", "provider": "smtp", "to": to_email}
        except Exception as e:
            logger.error(f"[Email:SMTP] Failed: {e}")
            return {"status": "error", "provider": "smtp", "detail": str(e)}

    logger.info(f"[Email] Neither Resend nor SMTP configured. OTP for {to_email}: {otp}")
    return {"status": "skipped", "reason": "No email provider credentials configured in environment."}
