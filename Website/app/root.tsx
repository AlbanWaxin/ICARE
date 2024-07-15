import { Outlet, Links,Scripts, LiveReload } from "@remix-run/react";

import type { LinksFunction } from "@remix-run/node";

import { createCookie } from "@remix-run/node";


import stylesUrl from "~/styles/root.css?url";
import stylesheet from "~/styles/tailwind.css?url";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl },{ rel: "icon", type:"image/x-icon" ,href:"/favicon.ico"},{ rel: "stylesheet", href: stylesheet}];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
        
        <title>ICARE</title>
      </head>
      <body>
        <SiteBar />
        <Outlet />
        <Scripts/>
      </body>
    </html>
  );
}

function SiteBar() {
  return (
    <div className="site-bar">
      <div className="site-bar-logo">
        <a href="/">
          <img src="/logo.png" alt="ICARE" />
        </a>
      </div>
    </div>
  );
}
