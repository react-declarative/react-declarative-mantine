import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MantineProvider theme={theme}><App /></MantineProvider>
  </React.StrictMode>
);
