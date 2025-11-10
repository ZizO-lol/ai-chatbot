import { forwardRef } from "react";
import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";

interface LinkProps extends Omit<RouterLinkProps, "to"> {
  href: string;
}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, ...props }, ref) => {
    return <RouterLink to={href} {...props} ref={ref} />;
  }
);

Link.displayName = "Link";

export default Link;
