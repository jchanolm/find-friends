// components/ui/Button.tsx
import React from 'react';

type ButtonVariant = 'default' | 'outline' | 'primary' | 'bubble';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'px-4 py-2 font-medium transition-all duration-200 focus:outline-none';
  
  const variantClasses = {
    default: 'rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    outline: 'rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    primary: 'rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    bubble: 'rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-md transform hover:-translate-y-0.5 shadow-sm'
  };
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};