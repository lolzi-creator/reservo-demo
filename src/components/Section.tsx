import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
}

// Layout wrapper component with consistent max-width and padding
export default function Section({ children, className = '' }: SectionProps) {
  return (
    <div className={`max-w-6xl mx-auto px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
