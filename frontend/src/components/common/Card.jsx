import React from 'react';
import './Card.css';

const Card = ({
  children,
  variant = 'default',
  size = 'md',
  padding = true,
  shadow = true,
  hover = false,
  clickable = false,
  className = '',
  onClick,
  ...props
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--${size}`,
    !padding && 'card--no-padding',
    !shadow && 'card--no-shadow',
    hover && 'card--hover',
    clickable && 'card--clickable',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (clickable && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`card__header ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className = '', ...props }) => (
  <div className={`card__body ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`card__footer ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle = ({ children, level = 3, className = '', ...props }) => {
  const Tag = `h${level}`;
  return (
    <Tag className={`card__title ${className}`} {...props}>
      {children}
    </Tag>
  );
};

const CardDescription = ({ children, className = '', ...props }) => (
  <p className={`card__description ${className}`} {...props}>
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;