import { Link } from 'react-router-dom';

export default function AccessibleLink({ to, children, ariaLabel, ...props }) {
  return (
    <Link
      to={to}
      {...props}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
    >
      {children}
    </Link>
  );
}
