import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const getStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
};

const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
const colors = [
  'bg-destructive',
  'bg-orange-400',
  'bg-yellow-400',
  'bg-emerald-400',
  'bg-emerald-500',
];

export const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const strength = useMemo(() => getStrength(password), [password]);

  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${i < strength ? colors[strength] : 'bg-muted'
              }`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[strength]}</p>
    </div>
  );
};
