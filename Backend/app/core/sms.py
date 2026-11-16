"""
CareerTrack BD — Twilio SMS Service.
Dispatches real SMS to candidate/admin phones for:
- 6-Digit OTP verification (Login, Signup, Password Reset)
- Admit card availability notices
- Exam seat plan & venue alerts
"""

import base64
import json
import logging
import os
import re
import urllib.parse
import urllib.request
from typing import Optional

logger = logging.getLogger(__name__)

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID", "")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN", "")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER", "+13163892530")


def format_bd_phone_number(raw_phone: str) -> Optional[str]:  # noqa: UP045
    """
    Standardizes a phone number to E.164 format (+8801XXXXXXXXX).
    """
    if not raw_phone:
        return None
    # Remove all non-numeric characters except +
    cleaned = re.sub(r"[^\d+]", "", raw_phone)
    cleaned = cleaned.removeprefix("+")

    # Handle local 01XXXXXXXXX
    if cleaned.startswith("01") and len(cleaned) == 11:
        return f"+88{cleaned}"
    elif cleaned.startswith("8801") and len(cleaned) == 13:
        return f"+{cleaned}"
    elif cleaned.startswith("1") and len(cleaned) == 10:
        # e.g. 1531329222
        return f"+880{cleaned}"
    elif cleaned.startswith("88"):
        return f"+{cleaned}"

    # If already with country code
    return f"+{cleaned}"


def send_sms(to_phone: str, message: str) -> dict:
    """
    Synchronously dispatches an SMS via Twilio REST API.
    Zero external dependencies (uses standard urllib).
    Supports either Main Auth Token or Twilio API Key (SK...).
    """
    account_sid = (os.getenv("TWILIO_ACCOUNT_SID") or os.getenv("TWILO_Account_Sid") or "").strip()
    auth_token = (os.getenv("TWILIO_AUTH_TOKEN") or os.getenv("TWILO_Auth_Token") or "").strip()
    api_key_sid = (os.getenv("SID") or os.getenv("TWILIO_API_KEY_SID") or "").strip()
    api_secret = (os.getenv("SECRET") or os.getenv("TWILIO_API_SECRET") or "").strip()
    from_number = (os.getenv("TWILIO_PHONE_NUMBER") or os.getenv("TWILIO_FROM_NUMBER") or "+13163892530").strip()

    if not account_sid:
        logger.warning("[SMS] Twilio Account SID (AC...) not configured. Skipping SMS.")
        return {"status": "skipped", "reason": "Twilio Account SID (AC...) not configured."}

    # Determine credentials
    if api_key_sid and api_secret:
        user_cred = api_key_sid
        pass_cred = api_secret
    elif auth_token:
        user_cred = account_sid
        pass_cred = auth_token
    else:
        logger.warning("[SMS] Neither Auth Token nor API Key Secret configured. Skipping SMS.")
        return {"status": "skipped", "reason": "No Twilio credentials configured."}

    formatted_to = format_bd_phone_number(to_phone)
    if not formatted_to:
        logger.warning(f"[SMS] Invalid phone number provided: {to_phone}")
        return {"status": "error", "reason": f"Invalid phone number format: {to_phone}"}

    url = f"https://api.twilio.com/2010-04-01/Accounts/{account_sid}/Messages.json"
    data = urllib.parse.urlencode({
        "From": from_number,
        "To": formatted_to,
        "Body": message,
    }).encode("utf-8")

    auth_header = base64.b64encode(f"{user_cred}:{pass_cred}".encode("utf-8")).decode("ascii")  # noqa: UP012

    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Basic {auth_header}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            res_body = json.loads(response.read().decode("utf-8"))
            logger.info(
                f"[SMS] Twilio SMS dispatched to {formatted_to}: SID {res_body.get('sid')}"
            )
            return {
                "status": "sent",
                "sid": res_body.get("sid"),
                "to": formatted_to,
                "message": message,
            }
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        logger.error(f"[SMS] Twilio HTTP Error {e.code}: {err_msg}")
        return {"status": "error", "code": e.code, "detail": err_msg}
    except Exception as ex:  # noqa: BLE001
        logger.error(f"[SMS] Failed to send SMS: {ex}")
        return {"status": "error", "detail": str(ex)}
