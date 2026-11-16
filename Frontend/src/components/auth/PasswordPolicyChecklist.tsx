import React from 'react';
import { CheckCircle2, XCircle, Sparkles, ShieldCheck, ShieldAlert, KeyRound, Copy, Check } from 'lucide-react';
import { PasswordValidationReport, generateStrongPassphrase, UserContextData } from '../../utils/passwordPolicy';

interface PasswordPolicyChecklistProps {
  report: PasswordValidationReport;
  passwordValue: string;
  onGeneratePassphrase: (newPassword: string) => void;
  userContext?: UserContextData;
}

export const PasswordPolicyChecklist: React.FC<PasswordPolicyChecklistProps> = ({
  report,
  passwordValue,
  onGeneratePassphrase,
  userContext,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleGenerate = () => {
    const generated = generateStrongPassphrase(userContext);
    onGeneratePassphrase(generated);
  };

  const handleCopy = () => {
    if (!passwordValue) return;
    navigator.clipboard.writeText(passwordValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strengthColor =
    report.score === 100
      ? 'bg-emerald-500'
      : report.score >= 60
      ? 'bg-amber-500'
      : report.score > 0
      ? 'bg-rose-500'
      : 'bg-zinc-700';

  const strengthLabel =
    report.score === 100
      ? 'Strong & Compliant'
      : report.score >= 60
      ? 'Moderate (Requirements Unmet)'
      : report.score > 0
      ? 'Weak'
      : 'Enter Password';

  return (
    <div className="mt-3 p-3.5 rounded-2xl bg-[#0e0c1a]/95 border border-purple-500/20 text-left space-y-3 transition-all">
      {/* Top Header & Passphrase Generator Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span className="text-[11px] font-bold text-zinc-300">Password Security Standards</span>
          {report.isValid && (
            <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Verified
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-sm shadow-purple-600/30 transition-all flex-shrink-0"
        >
          <Sparkles className="w-3 h-3 text-purple-200" />
          <span>Generate Strong Passphrase</span>
        </button>
      </div>

      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px]">
          <span className="text-zinc-400 font-medium">Strength: <strong className="text-zinc-200">{strengthLabel}</strong></span>
          <span className="font-mono font-bold text-zinc-300">{report.score}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${strengthColor}`}
            style={{ width: `${Math.max(report.score, 4)}%` }}
          />
        </div>
      </div>

      {/* Live Checklist Items */}
      <ul className="space-y-1.5 pt-1">
        {report.rules.map((rule) => {
          const isPassed = rule.passed;
          return (
            <li
              key={rule.id}
              className={`flex items-start gap-2 text-[11px] transition-colors leading-tight ${
                isPassed ? 'text-emerald-300' : 'text-zinc-400'
              }`}
            >
              {isPassed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5 animate-in fade-in zoom-in duration-150" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500/70 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <span className={isPassed ? 'font-medium' : 'text-zinc-400'}>{rule.label}</span>
                {rule.hint && !isPassed && passwordValue.length > 0 && (
                  <span className="block text-[10px] text-rose-400/90 mt-0.5">({rule.hint})</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Passphrase Info / Copy Banner if Generated */}
      {passwordValue.length > 0 && (
        <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1">
            {report.isValid ? (
              <>
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">All security gates satisfied!</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                <span className="text-amber-300 font-semibold">Form gated until all requirements turn green</span>
              </>
            )}
          </span>

          <button
            type="button"
            onClick={handleCopy}
            className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Password</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default PasswordPolicyChecklist;
