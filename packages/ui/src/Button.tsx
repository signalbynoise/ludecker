import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

function joinClasses(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

export function buttonClassName(
  variant: ButtonVariant = 'secondary',
  disabled?: boolean,
): string {
  return joinClasses(
    'ui-button',
    variant === 'primary' && 'ui-button--primary',
    variant === 'danger' && 'ui-button--danger',
    disabled && 'ui-button--disabled',
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({
  variant = 'secondary',
  className,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={joinClasses(buttonClassName(variant, disabled), className)}
      disabled={disabled}
      {...props}
    />
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
}

export function ButtonLink({
  variant = 'secondary',
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      className={joinClasses(buttonClassName(variant), className)}
      {...props}
    />
  );
}
