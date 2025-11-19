import React, { useState } from "react";
import { Button, Box, Text } from "@canva/app-ui-kit";
import { getCurrentPageContext, selection } from "@canva/design";

export default function App() {
  const [status, setStatus] = useState("Waiting…");

  async function scan() {
    try {
      setStatus("Scanning…");

      // Try to get the page
      const ctx = await getCurrentPageContext();

      if (!ctx) {
        setStatus("Not inside a design.");
        return;
      }

      // Canva does NOT provide full element lists.
      // The only element info we *can* read is current selection.
      const selected = await selection.get();

      const count = selected?.elements?.length ?? 0;

      setStatus(`Selected ${count} elements.`);
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
