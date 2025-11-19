import React, { useState } from "react";
import { Button, Box, Text } from "@canva/app-ui-kit";
import { getCurrentPageContext } from "@canva/design";

export default function App() {
  const [status, setStatus] = useState("Waiting…");

  async function scan() {
    try {
      setStatus("Scanning…");

      const ctx = await getCurrentPageContext();

      if (!ctx) {
        setStatus("Not inside a design.");
        return;
      }

      const count = ctx.elements.length;

      setStatus(`Found ${count} elements on this page.`);
    } catch (err) {
      console.error(err);
      setStatus("Error");
    }
  }

  return (
    <Box padding="small">
      <Button onClick={scan}>Scan page</Button>
      <Box padding="small">
        <Text>{status}</Text>
      </Box>
    </Box>
  );
}
