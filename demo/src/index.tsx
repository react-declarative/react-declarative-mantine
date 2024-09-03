import React from "react";
import ReactDOM from "react-dom/client";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import App from "./App";
import { OneSlotFactory } from "react-declarative-mantine";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <MantineProvider theme={theme}>
      <OneSlotFactory>
        <App />
      </OneSlotFactory>
    </MantineProvider>
);
