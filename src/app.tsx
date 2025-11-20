import { Box, Button, Select, Text, Rows } from "@canva/app-ui-kit";
import { getCurrentPageContext, overlay } from "@canva/design";
import { requestOpenExternalUrl } from "@canva/platform";
import React, { useState } from "react";
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

// Standard bleed options (US vs EU standards)
const bleedOptions = [
  { label: "0.125 in (Standard US)", value: 0.125 },
  { label: "3 mm (Standard EU)", value: 0.118 }, // approx 3mm in inches
  { label: "None", value: 0 }
];

export function App() {
  const [status, setStatus] = useState("Ready");
  const [radiusInches, setRadiusInches] = useState(0.25);
  const [bleedInches, setBleedInches] = useState(0.125);

  const intl = useIntl();

  // -------------------------
  // 1. APPLY PRINT GUIDES
  // -------------------------
  async function applyGuides() {
    try {
      setStatus("Generating guides…");

      const ctx = await getCurrentPageContext();
      if (!ctx || !ctx.dimensions) {
        setStatus("Could not read page size.");
        return;
      }

      const { width, height } = ctx.dimensions;
      // Convert inches to pixels for the offset
      const offset = bleedInches * INCH;

      // Clear any previous overlays
      await overlay.clear();

      // 1. Trim Box (Red) - The physical edge of the cut paper
      await overlay.addRectangle({
        x: 0,
        y: 0,
        width,
        height,
        strokeColor: "#FF0000",
        strokeWidth: 2,
        name: "Trim Box (Cut Line)"
      });

      // 2. Safe Margin (Green) - Keep text inside this!
      if (offset > 0) {
        await overlay.addRectangle({
          x: offset,
          y: offset,
          width: width - offset * 2,
          height: height - offset * 2,
          strokeColor: "#00FF00",
          strokeWidth: 1,
          name: "Safe Margin"
        });

        // 3. Bleed Box (Blue) - Backgrounds must extend to here
        // Note: Negative coordinates are outside the canvas
        await overlay.addRectangle({
          x: -offset,
          y: -offset,
          width: width + offset * 2,
          height: height + offset * 2,
          strokeColor: "#0000FF",
          strokeWidth: 1,
          name: "Bleed Area"
        });
      }

      setStatus("Guides applied!");

    } catch (err) {
      console.error("Guide generation error:", err);
      setStatus("Error generating guides.");
    }
  }

  // -------------------------
  // 2. ADD ROUNDED CORNERS
  // -------------------------
  async function addRoundedCorners() {
    try {
      setStatus("Adding rounded corner overlay…");
      const ctx = await getCurrentPageContext();
      if (!ctx || !ctx.dimensions) return;

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

      setStatus(`Rounded corners applied.`);
    } catch (err) {
      console.error(err);
    }
  }

  async function openDocs() {
    await requestOpenExternalUrl({ url: DOCS_URL });
  }

  return (
    <Box padding="2u">
      <Rows spacing="2u">
        <Text>
          {intl.formatMessage({
            defaultMessage: "Prepare your design for professional printing.",
            description: "App introduction"
          })}
        </Text>

        {/* BLEED SETTINGS */}
        <Box>
          <Text weight="bold">Bleed & Margin Size</Text>
          <Select
            value={bleedInches}
            onChange={(v) => setBleedInches(Number(v))}
            options={bleedOptions}
            stretch
          />
          <Text tone="secondary" size="small">
            Ensure "Show print bleed" is enabled in your Editor settings to see outside the canvas.
          </Text>
        </Box>

        {/* ACTION BUTTONS */}
        <Button variant="primary" onClick={applyGuides} stretch>
            Show Visual Guides
        </Button>

        <Box paddingTop="1u" paddingBottom="1u" borderTop="standard">
             <Text weight="bold">Extras</Text>
        </Box>

        {/* CORNER RADIUS */}
        <Box>
            <Text size="small">Corner Radius Overlay</Text>
            <Select
                value={radiusInches}
                onChange={(v) => setRadiusInches(Number(v))}
                options={radiusOptions}
                stretch
            />
            <Box paddingTop="1u">
                <Button variant="secondary" onClick={addRoundedCorners} stretch>
                    Add Corners
                </Button>
            </Box>
        </Box>

        {/* STATUS BAR */}
        <Box paddingTop="2u" borderTop="standard">
          <Text size="small" tone="secondary">Status: {status}</Text>
        </Box>

        <Button variant="tertiary" size="small" onClick={openDocs}>
          Help / Docs
        </Button>
      </Rows>
    </Box>
  );
}