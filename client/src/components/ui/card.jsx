import React from 'react';
import { cva } from 'class-variance-authority';

// Define card variants using class-variance-authority (cva)
const cardVariants = cva('rounded-lg border bg-white shadow-md', {
  variants: {
    variant: {
      default: 'border-gray-200',
      outlined: 'border-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

// Main Card component
export const Card = ({ children, className, variant, ...props }) => (
  <div className={`${cardVariants({ variant })} ${className}`} {...props}>
    {children}
  </div>
);

// Card content area
export const CardContent = ({ children, className, ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

// Card header with optional styling
export const CardHeader = ({ children, className, ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

// Card footer for additional content
export const CardFooter = ({ children, className, ...props }) => (
  <div className={`p-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);
