import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  animateHover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  title, 
  animateHover = false, 
  className = '', 
  ...props 
}) => {
  return (
    <div 
      className={`glass-panel ${animateHover ? 'glass-panel-hover animate-slide-up' : ''} ${className}`} 
      style={{ padding: '24px' }}
      {...props}
    >
      {title && (
        <h3 style={{ 
          fontSize: '1.25rem', 
          marginBottom: '16px', 
          fontFamily: 'var(--font-title)', 
          fontWeight: 600,
          borderBottom: '1px solid var(--border-card)',
          paddingBottom: '10px'
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
