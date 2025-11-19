import React, { useState } from "react";
import { Rows, Text, Title, Button, Box } from "@canva/app-ui-kit";
import { openDesign } from "@canva/design";

export const App = () => {
  const [status, setStatus] = useState("Idle");
  const [pageInfo, setPageInfo] = useState<any>(null);

  const scanPage = async () => {
    try {
      setStatus("Scanning…");

      // Correct SDK v2 usage — no callback!
      const session = await openDesign({ scope: "current_page" });

      const page = session.page;

      if (!page.dimensions) {
        setStatus("No fixed page dimensions available.");
        setPageInfo(null);
        return;
      }

      setPageInfo(page.dimensions);
      setStatus("Success!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to read design.");
      setPageInfo(null);
    }
  };

  return (
    <Box padding="2u">
      <Rows spacing="2u">
        <Title>Printssistant · Preflight</Title>
        <Text tone="secondary">Scan the current page dimensions.</Text>

        <Button variant="primary" onClick={scanPage}>
          Scan Current Page
        </Button>

        <Text>Status: {status}</Text>

        {pageInfo && (
          <Box padding="1u" border="weak" borderRadius="2u">
            <Text weight="bold">Page Dimensions</Text>
            <Text>Width: {pageInfo.width}px</Text>
            <Text>Height: {pageInfo.height}px</Text>
          </Box>
        )}
      </Rows>
    </Box>
  );
};
