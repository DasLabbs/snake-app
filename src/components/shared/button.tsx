import React from 'react';
import { cn } from '@src/libs/utils/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'lg';
};

const Button = (props: ButtonProps) => {
  const { children, className, disabled, variant = 'primary', size = 'lg', ...restProps } = props;
  return (
    <button
      className={
        cn(
          `px-2 text-base font-medium  outline-none ${className}`,
          `${variant === 'primary' ? 'text-[#B20025]' : 'text-white'}`
        ) + ` border-${variant} border-${size === 'sm' ? 'thick' : 'bold'}`
      }
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default Button;
