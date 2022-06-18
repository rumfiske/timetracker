import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    // Her sikre jeg alle bruger dark mode - Prøv og ændre til light eller halloween når i har set siden færdig i dark mode.
    <Html data-theme="dark">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
