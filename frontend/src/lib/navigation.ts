import {
  useLocation,
  useNavigate as useRouterNavigate,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useRouterNavigate();
  const location = useLocation();

  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
  };
}

export function usePathname() {
  const location = useLocation();
  return location.pathname;
}

export function useParams() {
  return useRouterParams();
}

export function useSearchParams() {
  const [searchParams, setSearchParams] = useRouterSearchParams();

  return {
    get: (name: string) => searchParams.get(name),
    getAll: (name: string) => searchParams.getAll(name),
    has: (name: string) => searchParams.has(name),
    set: (name: string, value: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set(name, value);
      setSearchParams(newParams);
    },
    delete: (name: string) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete(name);
      setSearchParams(newParams);
    },
    toString: () => searchParams.toString(),
  };
}
