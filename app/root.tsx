import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Meta tags */}
        <title>Antonio Wang Portfolio</title>
        <meta
          name="description"
          content="Portfolio of Antonio Wang - a passionate developer and street photographer. Coding by passion, capturing the streets by instinct."
        />
        <link rel="canonical" href="https://notreallyeight.dev" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook, LinkedIn, Discord, etc.) */}
        <meta property="og:title" content="Antonio Wang Portfolio" />
        <meta
          property="og:description"
          content="Portfolio of Antonio Wang - a passionate developer and street photographer. Coding by passion, capturing the streets by instinct."
        />
        <meta property="og:url" content="https://notreallyeight.dev" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Antonio Wang Portfolio" />
        <meta
          name="twitter:description"
          content="Portfolio of Antonio Wang - a passionate developer and street photographer. Coding by passion, capturing the streets by instinct."
        />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && Boolean(error) && error instanceof Error) {
    details = error.message;
    ({ stack } = error);
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack != null && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
