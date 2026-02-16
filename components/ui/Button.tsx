import Link from 'next/link';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps {
  asChild?: false;
  href?: never;
  type?: 'button' | 'submit' | 'reset';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

interface ButtonAsLink extends ButtonBaseProps {
  asChild: true;
  href: string;
  type?: never;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-magenta text-white hover:bg-magenta-dark active:bg-magenta-dark shadow-sm hover:shadow-md',
  secondary:
    'border-2 border-navy text-navy bg-transparent hover:bg-navy hover:text-white active:bg-navy-dark active:text-white',
  ghost:
    'bg-transparent text-charcoal hover:bg-sand active:bg-savanna',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled = false,
  loading = false,
  fullWidth = false,
  asChild,
  href,
  type = 'button',
  onClick,
  ...rest
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans',
    'transition-all duration-200',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy',
    'cursor-pointer select-none',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    (disabled || loading) && 'pointer-events-none opacity-60',
    className
  );

  if (asChild && href) {
    return (
      <Link
        href={href}
        className={baseClasses}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
        aria-disabled={disabled || loading}
        tabIndex={disabled || loading ? -1 : undefined}
      >
        {loading && <Spinner className="h-4 w-4" />}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      {...rest}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  );
}
