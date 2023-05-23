import "../styles/globals.css";
import StoreProvider from "../store/store-context";
import React from "react";

export default function App({ Component, pageProps }) {
  return (
    console.log(pageProps),
    (
      <StoreProvider>
        <Component {...pageProps} />
      </StoreProvider>
    )
  );
}
