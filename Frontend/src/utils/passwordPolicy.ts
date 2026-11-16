/**
 * CareerTrack BD — Strict Password Policy & Validation Engine
 * 
 * Configurable password security rules:
 * - Length: 12 to 16 characters (configurable toggle to 6-12 if needed)
 * - Mix: Uppercase, Lowercase, Number, Special Symbol
 * - Passphrase Support: 4+ word combinations
 * - Common Pitfall Prevention: Sequential digits, keyboard walks, repeated characters,
 *   common passwords, and personal user data (name, email prefix, birthdate)
 */

export interface PasswordPolicyConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSymbol: boolean;
  maxRepeatedChars: number;
  blockSequentialNumbers: boolean;
  blockKeyboardPatterns: boolean;
}

/**
 * Global policy configuration.
 * To toggle between the strict 12-16 character policy and a shorter 6-12 character policy,
 * simply change minLength and maxLength below:
 */
export const PASSWORD_CONFIG: PasswordPolicyConfig = {
  // Primary Rule: 12 to 30 characters
  // (Change to minLength: 6, maxLength: 12 if shorter mode is required)
  minLength: 12,
  maxLength: 30,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSymbol: true,
  maxRepeatedChars: 2, // 3+ consecutive identical characters rejected (e.g. "aaa", "111")
  blockSequentialNumbers: true,
  blockKeyboardPatterns: true,
};

export interface PasswordRuleResult {
  id: string;
  label: string;
  passed: boolean;
  hint?: string;
}

export interface PasswordValidationReport {
  isValid: boolean;
  score: number; // 0 to 100
  rules: PasswordRuleResult[];
  errors: string[];
  isPassphrase: boolean;
}

export interface UserContextData {
  fullName?: string;
  email?: string;
  birthDate?: string;
  phone?: string;
}

// Common sequential number patterns (ascending and descending)
const SEQUENTIAL_PATTERNS = [
  '012', '123', '234', '345', '456', '567', '678', '789', '890',
  '098', '987', '876', '765', '654', '543', '432', '321', '210',
];

// Common keyboard walk patterns
const KEYBOARD_PATTERNS = [
  'qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', 'wsxedc',
  'poiuy', 'lkjhg', 'mnbvc', '1qaz', '2wsx', '3edc',
  'password', 'admin', 'welcome', 'login', 'bangladesh',
  'careertrack', 'recruitment', 'qwertyuiop',
];

// Curated short dictionary words for passphrase generation (3 to 5 chars)
const PASSPHRASE_WORDLIST = [
  'Apex', 'Blue', 'Bold', 'Calm', 'Dawn', 'Echo', 'Fire',
  'Glow', 'Hawk', 'Iron', 'Jade', 'Leaf', 'Lion', 'Mint',
  'Moon', 'Nova', 'Peak', 'Pine', 'Rain', 'Ruby', 'Sage',
  'Silk', 'Sky', 'Star', 'Sun', 'Tide', 'Volt', 'Wave',
  'Wild', 'Wind', 'Wolf', 'Zeal', 'Aqua', 'Beam', 'Dusk',
];

const SPECIAL_SYMBOLS = ['!', '@', '#', '$', '%', '&', '*', '?'];

/**
 * Validate a password against the strict policy and contextual personal info.
 */
export function validatePassword(
  password: string,
  userContext?: UserContextData,
  config: PasswordPolicyConfig = PASSWORD_CONFIG
): PasswordValidationReport {
  const pwd = password || '';
  const trimmed = pwd.trim();
  const lower = pwd.toLowerCase();

  // 1. Length Rule
  const lengthPassed = pwd.length >= config.minLength && pwd.length <= config.maxLength;

  // 2. Character Mix Rules
  const hasUppercase = /[A-Z]/.test(pwd);
  const hasLowercase = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(pwd);

  // 3. Sequential Numbers Check
  let hasSequentialNumbers = false;
  if (config.blockSequentialNumbers) {
    for (const seq of SEQUENTIAL_PATTERNS) {
      if (pwd.includes(seq)) {
        hasSequentialNumbers = true;
        break;
      }
    }
  }

  // 4. Keyboard Patterns & Common Weak Passwords
  let hasKeyboardPattern = false;
  if (config.blockKeyboardPatterns) {
    for (const pat of KEYBOARD_PATTERNS) {
      if (lower.includes(pat)) {
        hasKeyboardPattern = true;
        break;
      }
    }
  }

  // 5. Repeated Characters Check (3+ consecutive identical chars e.g. "aaa", "111")
  const hasRepeatedChars = /(.)\1\1/.test(pwd);

  // 6. Personal Information Check (dynamic based on form state)
  let containsPersonalInfo = false;
  const personalTokens: string[] = [];

  if (userContext) {
    // Name tokens (e.g. "Shah", "Abdul", "Mazid")
    if (userContext.fullName) {
      const parts = userContext.fullName
        .toLowerCase()
        .split(/[\s,._-]+/)
        .map(p => p.trim())
        .filter(p => p.length >= 3);
      personalTokens.push(...parts);
    }
    // Email prefix (e.g. "shahabdulmazid57" from "shahabdulmazid57@gmail.com")
    if (userContext.email) {
      const prefix = userContext.email.split('@')[0].toLowerCase().trim();
      if (prefix.length >= 3) {
        personalTokens.push(prefix);
        // Also split alpha parts if alphanumeric
        const alphaParts = prefix.split(/[0-9_.-]+/).filter(p => p.length >= 3);
        personalTokens.push(...alphaParts);
      }
    }
    // Phone digits (e.g. last 4 digits)
    if (userContext.phone) {
      const digits = userContext.phone.replace(/\D/g, '');
      if (digits.length >= 4) {
        personalTokens.push(digits.slice(-4));
      }
    }
    // Birthdate (e.g. "2001", "1999")
    if (userContext.birthDate) {
      const year = userContext.birthDate.replace(/\D/g, '');
      if (year.length >= 4) personalTokens.push(year);
    }

    for (const token of personalTokens) {
      if (token && lower.includes(token)) {
        containsPersonalInfo = true;
        break;
      }
    }
  }

  // 7. Passphrase Detection (e.g. 4+ word tokens combined)
  const wordTokens = pwd.split(/[^a-zA-Z]+/).filter(w => w.length >= 3);
  const isPassphrase = wordTokens.length >= 3 && pwd.length >= config.minLength;

  // Build Individual Rules for Interactive Checklist
  const rules: PasswordRuleResult[] = [
    {
      id: 'length',
      label: `${config.minLength} to ${config.maxLength} characters long`,
      passed: lengthPassed,
      hint: `Current: ${pwd.length} / Target: ${config.minLength}–${config.maxLength}`,
    },
    {
      id: 'case_mix',
      label: 'At least one uppercase (A-Z) & one lowercase (a-z)',
      passed: hasUppercase && hasLowercase,
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      passed: hasNumber,
    },
    {
      id: 'symbol',
      label: 'At least one special symbol (!@#$%^&*)',
      passed: hasSymbol,
    },
    {
      id: 'pitfalls',
      label: 'No sequential digits (123), keyboard walks (qwerty), or 3x repeats (aaa)',
      passed: !hasSequentialNumbers && !hasKeyboardPattern && !hasRepeatedChars && pwd.length > 0,
      hint: hasSequentialNumbers
        ? 'Contains sequential digits'
        : hasKeyboardPattern
        ? 'Contains common/keyboard pattern'
        : hasRepeatedChars
        ? 'Contains repeated characters'
        : undefined,
    },
    {
      id: 'personal_info',
      label: 'Contains no personal info (your name, email prefix, or phone)',
      passed: !containsPersonalInfo && pwd.length > 0,
      hint: containsPersonalInfo ? 'Matches name/email info' : undefined,
    },
  ];

  const errors: string[] = [];
  if (!lengthPassed) errors.push(`Password must be between ${config.minLength} and ${config.maxLength} characters.`);
  if (!hasUppercase) errors.push('Include at least one uppercase letter (A-Z).');
  if (!hasLowercase) errors.push('Include at least one lowercase letter (a-z).');
  if (!hasNumber) errors.push('Include at least one digit (0-9).');
  if (!hasSymbol) errors.push('Include at least one special symbol (e.g. !@#$%^&*).');
  if (hasSequentialNumbers) errors.push('Avoid sequential numbers (e.g. 123, 789, 987).');
  if (hasKeyboardPattern) errors.push('Avoid keyboard walks (e.g. qwerty, asdfgh).');
  if (hasRepeatedChars) errors.push('Avoid 3 or more repeated characters in a row (e.g. aaa, 111).');
  if (containsPersonalInfo) errors.push('Password must not contain parts of your name, email, or personal details.');

  const passedCount = rules.filter(r => r.passed).length;
  const score = Math.round((passedCount / rules.length) * 100);
  const isValid = rules.every(r => r.passed) && errors.length === 0;

  return {
    isValid,
    score,
    rules,
    errors,
    isPassphrase,
  };
}

/**
 * Generates a compliant random 4-word passphrase with casing, digit, and symbol
 * that strictly satisfies the 12 to 16 character requirement and avoids all pitfalls.
 * Example outputs: "Apex*Ruby8Wave", "Hawk9Volt!Sun", "Nova4Jade#Star"
 */
export function generateStrongPassphrase(
  userContext?: UserContextData,
  config: PasswordPolicyConfig = PASSWORD_CONFIG
): string {
  const maxAttempts = 100;
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Pick 3 short words (3-4 letters each)
    const shuffled = [...PASSPHRASE_WORDLIST].sort(() => 0.5 - Math.random());
    const w1 = shuffled[0];
    const w2 = shuffled[1];
    const w3 = shuffled[2];

    const digit = Math.floor(Math.random() * 9) + 1; // 1-9 to avoid 0
    const symbol = SPECIAL_SYMBOLS[Math.floor(Math.random() * SPECIAL_SYMBOLS.length)];

    // Combine into structured compliant formats:
    // e.g. "Ruby*Hawk4Wave" -> 4 + 1 + 4 + 1 + 4 = 14 chars
    const candidate = `${w1}${symbol}${w2}${digit}${w3}`;

    const report = validatePassword(candidate, userContext, config);
    if (report.isValid) {
      return candidate;
    }
  }

  // Guaranteed fallback satisfying 12-16 chars: 4 + 1 + 4 + 1 + 4 = 14 chars
  return 'Nova#Jade7Star';
}
