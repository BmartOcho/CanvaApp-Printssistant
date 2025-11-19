import React, { useState } from "react";
import { Button, Box, Text } from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import { useAddElement } from "../utils/use_add_element";
import { useIntl } from "react-intl";

export const DOCS_URL = "https://www.canva.dev/docs/apps/";

export function App() {
  const [status, setStatus] = useState("Ready");
  const addElement = useAddElement();
  const intl = useIntl();

  async function applyGuides() {
    try {
      setStatus(intl.formatMessage({
        defaultMessage: "Generating guides…",
        description: "Status message when guides are being generated"
      }));

      // Simulate guide generation for print materials
      // In a real implementation, this would interact with Canva's page features
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus(intl.formatMessage({
        defaultMessage: "Guides applied!",
        description: "Success message when guides are applied"
      }));

    } catch {
      setStatus(intl.formatMessage({
        defaultMessage: "Error generating guides.",
        description: "Error message when guide generation fails"
      }));
    }
  }

  async function doSomethingCool() {
    try {
      setStatus(intl.formatMessage({
        defaultMessage: "Adding text element...",
        description: "Status message when adding a text element"
      }));
      await addElement({
        type: "text",
        children: ["Hello from Canva App!"],
      });
      setStatus(intl.formatMessage({
        defaultMessage: "Text element added!",
        description: "Success message when text element is added"
      }));
    } catch {
      setStatus(intl.formatMessage({
        defaultMessage: "Error adding element.",
        description: "Error message when adding element fails"
      }));
    }
  }

  async function openDocs() {
    await requestOpenExternalUrl({
      url: DOCS_URL,
    });
  }

  return (
    <Box padding="1u">
      <Text>
        {intl.formatMessage({
          defaultMessage: "To make changes to this app, edit the {filename} file, then close and reopen the app in the editor to preview the changes.",
          description: "Instructions for users to modify the app"
        }, { filename: "src/app.tsx" })}
      </Text>

      <Box padding="1u">
        <Button variant="primary" onClick={doSomethingCool}>
          {intl.formatMessage({
            defaultMessage: "Do something cool",
            description: "Button text for adding text element"
          })}
        </Button>
      </Box>

      <Box padding="1u">
        <Button variant="secondary" onClick={applyGuides}>
          {intl.formatMessage({
            defaultMessage: "Apply Guides",
            description: "Button text for applying print guides"
          })}
        </Button>
      </Box>

      <Box padding="1u">
        <Text>{status}</Text>
      </Box>

      <Box padding="1u">
        <Button variant="tertiary" onClick={openDocs}>
          {intl.formatMessage({
            defaultMessage: "Open Canva Apps SDK docs",
            description: "Button text for opening SDK documentation"
          })}
        </Button>
      </Box>
    </Box>
  );
}

// Default export for main entry point
export default App;
