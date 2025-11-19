import React, { useState } from "react";
import { Button, Box, Text, Select } from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import { overlay, getCurrentPageContext } from "@canva/design";
import { useAddElement } from "../utils/use_add_element";
import { useIntl } from "react-intl";

export const DOCS_URL = "https://www.canva.dev/docs/apps/";

const INCH = 96;

// Dropdown values for corner radius
const radiusOptions = [
  { label: "0.125 in", value: 0.125 },
  { label: "0.25 in (default)", value: 0.25 },
  { label: "0.375 in", value: 0.375 },
  { label: "0.5 in", value: 0.5 }
];

export function App() {
  const [status, setStatus] = useState("Ready");
  const [radiusInches, setRadiusInches] = useState(0.25);

  const intl = useIntl();
  const addElement = useAddElement();

  // -------------------------
  // APPLY PRINT GUIDES
  // -------------------------
  async function applyGuides() {
    try {
      setStatus(intl.formatMessage({
        defaultMessage: "Generating guides…",
        description: "Status message when guides are being generated"
      }));

      const ctx = await getCurrentPageContext();
      if (!ctx || !ctx.dimensions) {
        setStatus("Could not read page size.");
        return;
      }

      const { width, height } = ctx.dimensions;
      const offset = 0.125 * INCH;  // bleed + margin amount

      // Clear any previous overlays
      await overlay.clear();

      // Trim (Red)
      await overlay.addRectangle({
        x: 0,
        y: 0,
        width,
        height,
        strokeColor: "#FF0000",
        strokeWidth: 2,
        name: "Trim Box"
      });

      // Safe Margin (Green)
      await overlay.addRectangle({
        x: offset,
        y: offset,
        width: width - offset * 2,
        height: height - offset * 2,
        strokeColor: "#00FF00",
        strokeWidth: 2,
        name: "Margin Box"
      });

      // Bleed (Blue)
      await overlay.addRectangle({
        x: -offset,
        y: -offset,
        width: width + offset * 2,
        height: height + offset * 2,
        strokeColor: "#0000FF",
        strokeWidth: 2,
        name: "Bleed Box"
      });

      setStatus(intl.formatMessage({
        defaultMessage: "Guides applied!",
        description: "Success message when guides are applied"
      }));

    } catch (err) {
      console.error("Guide generation error:", err);
      setStatus(intl.formatMessage({
        defaultMessage: "Error generating guides.",
        description: "Error message when guide generation fails"
      }));
    }
  }

  // -------------------------
  // ADD ROUNDED CORNER OVERLAY
  // -------------------------
  async function addRoundedCorners() {
    try {
      setStatus("Adding rounded corner overlay…");

      const ctx = await getCurrentPageContext();
      if (!ctx || !ctx.dimensions) {
        setStatus("Could not read page size.");
        return;
      }

      const { width, height } = ctx.dimensions;
      const r = radiusInches * INCH;

      await overlay.addRectangle({
        x: 0,
        y: 0,
        width,
        height,
        cornerRadius: r,
        strokeColor: "#FF00FF",
        strokeWidth: 3,
        name: `Rounded Corners (${radiusInches} in)`
      });

      setStatus(`Rounded corners applied (${radiusInches} in).`);

    } catch (err) {
      console.error("Round corner error:", err);
      setStatus("Error adding rounded corners.");
    }
  }

  // -------------------------
  // SAMPLE TEXT ELEMENT (demo)
  // -------------------------
  async function doSomethingCool() {
    try {
      setStatus(intl.formatMessage({
        defaultMessage: "Adding text element...",
        description: "Status when adding text element"
      }));

      await addElement({
        type: "text",
        children: ["Hello from Canva App!"],
      });

      setStatus(intl.formatMessage({
        defaultMessage: "Text element added!",
        description: "Success text"
      }));

    } catch {
      setStatus(intl.formatMessage({
        defaultMessage: "Error adding element.",
        description: "Error adding element"
      }));
    }
  }

  async function openDocs() {
    await requestOpenExternalUrl({ url: DOCS_URL });
  }

  return (
    <Box padding="1u">
      <Text>
        {intl.formatMessage({
          defaultMessage:
            "To make changes to this app, edit the {filename} file, then close and reopen the app in the editor to preview the changes.",
          description: "Instructions text"
        }, { filename: "src/app.tsx" })}
      </Text>

      <Box padding="1u">
        <Button variant="primary" onClick={doSomethingCool}>
          {intl.formatMessage({
            defaultMessage: "Do something cool",
            description: "Button text"
          })}
        </Button>
      </Box>

      <Box padding="1u">
        <Button variant="secondary" onClick={applyGuides}>
          Apply Guides
        </Button>
      </Box>

      <Box padding="1u">
        <Text weight="bold">Rounded Corner Radius</Text>
        <Select
          value={radiusInches}
          onChange={(v) => setRadiusInches(Number(v))}
          options={radiusOptions}
        />
      </Box>

      <Box padding="1u">
        <Button variant="secondary" onClick={addRoundedCorners}>
          Add Round Corners
        </Button>
      </Box>

      <Box padding="1u">
        <Text>{status}</Text>
      </Box>

      <Box padding="1u">
        <Button variant="tertiary" onClick={openDocs}>
          {intl.formatMessage({
            defaultMessage: "Open Canva Apps SDK docs",
            description: "Open docs button"
          })}
        </Button>
      </Box>
    </Box>
  );
}

export default App;
