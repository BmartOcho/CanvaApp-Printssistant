import React, { useState } from "react";
import { Box, Text, Select, Rows, Button } from "@canva/app-ui-kit";
import { addElementAtPoint, getCurrentPageContext } from "@canva/design";
import { PRINT_JOBS } from "./data/print_specs";
import { ChecklistItem } from "./components/ChecklistItem";

const INCH = 96;

export default function App() {
  // App State
  const [step, setStep] = useState<"setup" | "checklist">("setup");
  const [selectedJobId, setSelectedJobId] = useState(PRINT_JOBS[0].id);
  const [completedChecks, setCompletedChecks] = useState<string[]>([]);
  const [sizeWarning, setSizeWarning] = useState<string | null>(null);

  const currentJob = PRINT_JOBS.find(j => j.id === selectedJobId) || PRINT_JOBS[0];

  // -------------------------
  // LOGIC: Size Verification
  // -------------------------
  async function verifySize() {
    const ctx = await getCurrentPageContext();
    if (!ctx || !ctx.dimensions) return;

    const { width, height } = ctx.dimensions;
    const currentW = width / INCH;
    const currentH = height / INCH;

    const isMatch = 
      (Math.abs(currentW - currentJob.width) < 0.05 && Math.abs(currentH - currentJob.height) < 0.05) ||
      (Math.abs(currentW - currentJob.height) < 0.05 && Math.abs(currentH - currentJob.width) < 0.05);

    if (isMatch) {
      setStep("checklist");
      setSizeWarning(null);
    } else {
      setSizeWarning(
        `Current size (${currentW.toFixed(2)}" x ${currentH.toFixed(2)}") does not match ${currentJob.name} (${currentJob.width}" x ${currentJob.height}"). Please resize your design.`
      );
    }
  }

  // -------------------------
  // LOGIC: Add Trim & Bleed Guide (Visualization Only)
  // -------------------------
  async function addGuides() {
    const ctx = await getCurrentPageContext();
    if (!ctx || !ctx.dimensions) return;

    const { width, height } = ctx.dimensions;
    const bleed = currentJob.bleed * INCH;
    
    // Draw Trim Box (Red) - The final cut line
    await addBox(0, 0, width, height, "#FF0000", "Trim Box (Cut Line)");
    
    // Draw Bleed Box (Blue) - Visualizing the required 1/8" or 3mm space
    if (bleed > 0) {
        await addBox(-bleed, -bleed, width + (bleed * 2), height + (bleed * 2), "#0000FF", "Bleed Guide");
    }
    toggleComplete("trim_bleed_guide_added");
  }

  async function addBox(x: number, y: number, w: number, h: number, color: string, name: string) {
    const thickness = 2;
    const paths = [
        { d: `M 0 0 H ${w} V ${thickness} H 0 Z`, fill: { color } },
        { d: `M 0 ${h - thickness} H ${w} V ${h} H 0 Z`, fill: { color } },
        { d: `M 0 0 H ${thickness} V ${h} H 0 Z`, fill: { color } },
        { d: `M ${w - thickness} 0 H ${w} V ${h} H ${w - thickness} Z`, fill: { color } }
    ];
    await addElementAtPoint({ type: "shape", top: y, left: x, width: w, height: h, paths, viewBox: { width: w, height: h, top: 0, left: 0 }, name } as any);
  }

  // -------------------------
  // VIEW LOGIC
  // -------------------------
  const toggleComplete = (id: string) => {
    setCompletedChecks(prev => {
        // Toggle logic: If already checked, remove it. If not, add it.
        const isCurrentlyChecked = prev.includes(id);
        if (isCurrentlyChecked) {
            return prev.filter(item => item !== id);
        }
        return [...prev, id];
    });
  };

  const allDone = completedChecks.length >= 4; // Check 4 items now

  // -------------------------
  // VIEW: Setup Screen (Step 1)
  // -------------------------
  if (step === "setup") {
    return (
      <Box padding="2u">
        <Rows spacing="2u">
          <Text size="large" weight="bold">Printssistant Job Setup</Text>
          <Text>Select your target print product to begin preflight checks.</Text>
          
          <Select
            value={selectedJobId}
            onChange={(v) => { setSelectedJobId(v); setSizeWarning(null); setCompletedChecks([]); }}
            options={PRINT_JOBS.map(j => ({ label: j.name, value: j.id }))}
            stretch
          />

          {sizeWarning && (
            <Box background="criticalLow" padding="1u" borderRadius="standard">
              <Text tone="critical" size="small">{sizeWarning}</Text>
            </Box>
          )}

          <Button variant="primary" onClick={verifySize} stretch>
            Start Preflight
          </Button>
          
          {sizeWarning && (
             <Button variant="secondary" onClick={() => setStep("checklist")} stretch>
               Proceed Anyway
             </Button>
          )}
        </Rows>
      </Box>
    );
  }

  // -------------------------
  // VIEW: Checklist Screen (Steps 2 & 3)
  // -------------------------
  return (
    <Box padding="2u">
      <Rows spacing="2u">
        <Box borderBottom="standard" paddingBottom="1u">
            <Text size="large" weight="bold">Preflight: {currentJob.name}</Text>
            <Button variant="tertiary" size="small" onClick={() => setStep("setup")}>Change Job</Button>
        </Box>

        {/* CHECK 1: GUIDE VISUALIZATION (Action/Required) */}
        <ChecklistItem
          title="1. Visualize Trim & Bleed"
          isComplete={completedChecks.includes("trim_bleed_guide_added")}
          onComplete={() => toggleComplete("trim_bleed_guide_added")}
          buttonLabel="Add Trim/Bleed Guides"
          onAction={addGuides}
          description={
            <Rows spacing="1u">
              <Text>Add temporary color-coded guides to ensure your design is safe to cut.</Text>
              <Text size="small">
                * **Red Box:** The final trim/cut line.<br/>
                * **Blue Box:** The {currentJob.bleed}" bleed edge.<br/>
                <br/>
                Click the button to add these guides as layers.
              </Text>
            </Rows>
          }
        />
        
        {/* CHECK 2: SAFE ZONE/MARGIN CHECK (Native Feature) */}
        <ChecklistItem
          title="2. Check Safe Zone Margins"
          isComplete={completedChecks.includes("native_margins")}
          onComplete={() => toggleComplete("native_margins")}
          buttonLabel=""
          description={
            <Rows spacing="1u">
              <Text>Ensure vital elements like logos and text are away from the edges.</Text>
              <Text size="small">
                1. Go to **File {'>'} View Settings**.<br/>
                2. Enable **Show Margins**.<br/>
                3. Ensure no text or logos are on or outside the dotted margin line.
              </Text>
            </Rows>
          }
        />

        {/* CHECK 3: BLEED CHECK (Native Feature) */}
        <ChecklistItem
          title="3. Verify Bleed Coverage"
          isComplete={completedChecks.includes("bleed_coverage")}
          onComplete={() => toggleComplete("bleed_coverage")}
          buttonLabel=""
          description={
            <Rows spacing="1u">
              <Text>Does your background or imagery extend past the cut line?</Text>
              <Text size="small">
                1. Go to **File {'>'} View Settings** and enable **Show print bleed**.<br/>
                2. Stretch your background to cover all white space up to the **Blue Bleed Guide**.
              </Text>
            </Rows>
          }
        />

        {/* CHECK 4: COLOR AND DPI (Export Settings) */}
        <ChecklistItem
          title="4. Color & Resolution Check"
          isComplete={completedChecks.includes("color_dpi")}
          onComplete={() => toggleComplete("color_dpi")}
          buttonLabel=""
          description={
            <Rows spacing="1u">
              <Text>Final check on image quality and color space conversion.</Text>
              <Text size="small">
                * **Color:** Print requires CMYK. Go to **Share {'>'} Download**, select **PDF Print**, and choose **CMYK** (Pro feature) for accurate colors.<br/>
                * **DPI:** Zoom in to **200%** on any image. If it looks blurry on-screen, it will print blurry (300 DPI minimum).
              </Text>
            </Rows>
          }
        />


        {/* SUCCESS STATE */}
        {allDone && (
          <Box background="positiveLow" padding="2u" borderRadius="standard" marginTop="2u">
            <Rows spacing="1u">
              <Text weight="bold" tone="positive">🎉 Ready for Production!</Text>
              <Text>
                Final steps: 
                <br/>1. **Delete** the red/blue guide elements.
                <br/>2. Go to **Share {'>'} Download**, select **PDF Print**, and check the option for **Crop marks and bleed**.
              </Text>
            </Rows>
          </Box>
        )}
      </Rows>
    </Box>
  );
}