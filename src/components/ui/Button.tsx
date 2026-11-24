import React from 'react';
import Link from 'next/link';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonSurface = 'light' | 'dark' | 'brand';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonStyleOptions {
  variant?: ButtonVariant;
  surface?: ButtonSurface;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

const BASE_CLASSES =
  'group inline-flex items-center justify-center rounded-full font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4F00] focus-visible:ring-offset-2';

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs gap-1.5',
  md: 'px-5 py-2.5 text-sm gap-2',
  lg: 'px-7 py-3.5 text-sm gap-2',
};

const VARIANT_CLASSES: Record<ButtonSurface, Record<ButtonVariant, string>> = {
  light: {
    primary:
      'bg-[#FF4F00] text-white hover:bg-[#E04500] shadow-xs hover:shadow-card',
    secondary:
      'bg-surface text-ink border border-border-warm hover:border-[#FF4F00] hover:bg-[#FF4F00] hover:text-white shadow-2xs',
  },
  dark: {
    primary:
      'bg-[#FF4F00] text-white hover:bg-[#E04500] shadow-md hover:shadow-lg',
    secondary:
      'bg-white/12 text-white border border-white/25 backdrop-blur-md hover:bg-white hover:text-zinc-950 hover:border-white',
  },
  brand: {
    primary:
      'bg-[#121212] text-white hover:bg-black shadow-md',
    secondary:
      'bg-white/15 text-white border border-white/30 hover:bg-white hover:text-zinc-950 hover:border-white',
  },
};

export function buttonStyles({
  variant = 'primary',
  surface = 'light',
  size = 'md',
  fullWidth = false,
  className = '',
}: ButtonStyleOptions = {}): string {
  return [
    BASE_CLASSES,
    SIZE_CLASSES[size],
    VARIANT_CLASSES[surface][variant],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  surface?: ButtonSurface;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  surface = 'light',
  size = 'md',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, surface, size, fullWidth, className })}
      {...props}
    />
  );
}

export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: ButtonVariant;
  surface?: ButtonSurface;
  size?: ButtonSize;
  fullWidth?: boolean;
  external?: boolean;
}

export function ButtonLink({
  href,
  variant = 'primary',
  surface = 'light',
  size = 'md',
  fullWidth = false,
  external,
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  const classes = buttonStyles({ variant, surface, size, fullWidth, className });
  const isExternal =
    external ??
    (href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:'));

  if (isExternal || href.startsWith('#')) {
    return (
      <a
        href={href}
        className={classes}
        {...(isExternal && !href.startsWith('mailto:') && !href.startsWith('tel:')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

