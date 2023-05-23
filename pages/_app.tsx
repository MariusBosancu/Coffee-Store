import "../styles/globals.css";
import StoreProvider from "../store/store-context";
import React from "react";
import type { AppProps } from "next/app";
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <StoreProvider>
      <Component {...pageProps} />
    </StoreProvider>
  );
}
