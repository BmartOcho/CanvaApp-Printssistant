import { addElementAtCursor } from "@canva/design";

export function useAddElement() {
  return async function addElement(options: any) {
    return addElementAtCursor(options);
  };
}
