"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com" async></script>
      </head>
      <body className="antialiased">
        <Provider store={store}>{children}</Provider>
      </body>
    </html>
  );
}
