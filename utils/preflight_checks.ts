import { getContent, getCurrentPageContext } from "@canva/design";

export interface PreflightIssue {
  id: string;
  type: "warning" | "error";
  message: string;
}

const INCH = 96;

/**
 * Checks for text elements that are dangerously close to the print edge.
 * @param safeMarginInches - The safe distance from the edge (e.g., 0.125 or 0.25)
 */
export async function checkMargins(safeMarginInches: number): Promise<PreflightIssue[]> {
  const issues: PreflightIssue[] = [];
  const safeMarginPx = safeMarginInches * INCH;

  // 1. Get Page Dimensions
  const ctx = await getCurrentPageContext();
  if (!ctx || !ctx.dimensions) {
    return [{ id: "sys-error", type: "error", message: "Could not read page dimensions" }];
  }

  const { width: pageWidth, height: pageHeight } = ctx.dimensions;

  // 2. Get Page Content
  // We need to wrap this in a try/catch because permissions might not be set correctly
  try {
    const content = await getContent();
    
    // 3. Loop through all elements on the page
    // Note: 'content.elements' is the array of items on the canvas
    for (const element of content.elements) {
      // We generally only care about text being cut off. 
      // Images extending to the edge is usually intentional (full bleed).
      if (element.type === "text") {
        
        // Check Left/Top edges
        const tooCloseLeft = element.left < safeMarginPx;
        const tooCloseTop = element.top < safeMarginPx;
        
        // Check Right/Bottom edges (Position + Size vs Page Size - Margin)
        const tooCloseRight = (element.left + element.width) > (pageWidth - safeMarginPx);
        const tooCloseBottom = (element.top + element.height) > (pageHeight - safeMarginPx);

        if (tooCloseLeft || tooCloseTop || tooCloseRight || tooCloseBottom) {
          issues.push({
            id: element.ref || Math.random().toString(), // Use element ref if available
            type: "warning",
            message: `Text element is too close to the edge (Safe zone: ${safeMarginInches}")`
          });
        }
      }
    }
  } catch (error) {
    console.error(error);
    issues.push({ 
      id: "perm-error", 
      type: "error", 
      message: "Could not read content. Ensure 'canva:design:content:read' permission is in canva-app.json" 
    });
  }

  return issues;
}