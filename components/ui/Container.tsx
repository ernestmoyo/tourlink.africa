import { cn } from '@/lib/utils';

type ContainerVariant = 'default' | 'narrow' | 'wide';

interface ContainerProps {
  variant?: ContainerVariant;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
}

const variantClasses: Record<ContainerVariant, string> = {
  default: 'max-w-7xl',
  narrow: 'max-w-4xl',
  wide: 'max-w-[1536px]',
};

export function Container({
  variant = 'default',
  className,
  children,
  as: Component = 'div',
}: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </Component>
  );
}
