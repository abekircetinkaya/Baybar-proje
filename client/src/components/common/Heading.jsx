import React from 'react';

const Heading = ({
  children,
  level = 1,
  className = '',
  gradient = false,
  ...props
}) => {
  const Tag = `h${level}`;
  
  const baseClasses = 'font-heading font-semibold';
  const gradientClasses = gradient ? 'text-gradient' : '';
  
  const classes = `${baseClasses} ${gradientClasses} ${className}`.trim();

  return (
    <Tag className={classes} {...props}>
      {children}
    </Tag>
  );
};

export default Heading;
