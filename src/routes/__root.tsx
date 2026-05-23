import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-semibold text-foreground">404</h1>
        <h2 className="mt-3 text-base font-semibold text-foreground">Surface not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The Console surface you requested does not exist.
        </p>
        <div className="mt-6">
          <Link
            to="/console"
            className="inline-flex items-center justify-center rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-2"
          >
            Return to Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-base font-semibold text-foreground">Surface failed to load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A Console surface encountered an error. Try again.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-2"
          >
            Try again
          </button>
          <Link
            to="/console"
            className="rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface-2"
          >
            Command Center
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "NIOV Foundation Console" },
      {
        name: "description",
        content:
          "Operational control plane for governed memory, scoped intelligence, audit, and enterprise AI infrastructure.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
