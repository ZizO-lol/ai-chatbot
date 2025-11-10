import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { forwardRef } from 'react';

interface LinkProps extends Omit<RouterLinkProps, 'to'> {
  href: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ href, ...props }, ref) => {
  return <RouterLink to={href} {...props} ref={ref} />;
});

Link.displayName = 'Link';

export default Link;
