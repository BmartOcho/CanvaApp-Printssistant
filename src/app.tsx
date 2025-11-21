import React, { useState } from "react";
import { Button, Box, Text, Select, Rows } from "@canva/app-ui-kit";
import { requestOpenExternalUrl } from "@canva/platform";
import { addElementAtPoint, getCurrentPageContext } from "@canva/design";
import { useIntl } from "react-intl";

export const DOCS_URL = "https://www.canva.dev/docs/apps/";

const INCH = 96;

// Standard bleed options
const bleedOptions = [
  { label: "0.125 in (Standard US)", value: 0.125 },
  { label: "3 mm (Standard EU)", value: 0.118 },
  { label: "None", value: 0 }
];

export default function App() {
  const [status, setStatus] = useState("Ready");
  const [bleedInches, setBleedInches] = useState(0.125);

  const intl = useIntl();

  /**
   * Helper to draw a rectangular outline using 4 thin lines.
   * We use this because "stroke" support varies on shapes, but filled rectangles are reliable.
   */
  async function addGuideBox(x: number, y: number, w: number, h: number, color: string, name: string) {
    const thickness = 2; // Line thickness in pixels
    
    // Define 4 rectangles to form a box outline
    const paths = [
        // Top
        { d: `M 0 0 H ${w} V ${thickness} H 0 Z`, fill: { color } },
        // Bottom
        { d: `M 0 ${h - thickness} H ${w} V ${h} H 0 Z`, fill: { color } },
        // Left
        { d: `M 0 0 H ${thickness} V ${h} H 0 Z`, fill: { color } },
        // Right
        { d: `M ${w - thickness} 0 H ${w} V ${h} H ${w - thickness} Z`, fill: { color } }
    ];

    await addElementAtPoint({
      type: "shape",
      top: y,
      left: x,
      width: w,
      height: h,
      paths: paths,
      viewBox: { width: w, height: h, top: 0, left: 0 }
    });
  }

  // -------------------------
  // APPLY PRINT GUIDES
  // -------------------------
  async function applyGuides() {
    try {
      setStatus("Adding guides...");

      const ctx = await getCurrentPageContext();
      if (!ctx || !ctx.dimensions) {
        setStatus("Could not read page size.");
        return;
      }

      const { width, height } = ctx.dimensions;
      const offset = bleedInches * INCH;

      // 1. Trim Box (Red) - The cut line
      await addGuideBox(0, 0, width, height, "#FF0000", "Trim Box");

      // 2. Safe Margin (Green) - Inside the cut line
      if (offset > 0) {
        await addGuideBox(
            offset, 
            offset, 
            width - (offset * 2), 
            height - (offset * 2), 
            "#00FF00", 
            "Safe Margin"
        );

        // 3. Bleed Box (Blue) - Outside the cut line
        // Note: Elements added at negative coordinates might only be visible 
        // if "Show print bleed" is enabled in Canva settings.
        await addGuideBox(
            -offset, 
            -offset, 
            width + (offset * 2), 
            height + (offset * 2), 
            "#0000FF", 
            "Bleed Box"
        );
      }

      setStatus("Guides added as elements.");

    } catch (err) {
      console.error("Guide error:", err);
      setStatus("Error adding guides.");
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
            defaultMessage: "Add print guides to your design.",
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
            Note: These guides are added as shape elements. You can delete them before printing.
          </Text>
        </Box>

        <Button variant="primary" onClick={applyGuides} stretch>
            Add Visual Guides
        </Button>

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