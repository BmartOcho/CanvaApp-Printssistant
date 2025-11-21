import React, { useState } from "react";
import { Button, Box, Text, Rows } from "@canva/app-ui-kit";

interface ChecklistItemProps {
  title: string;
  description: React.ReactNode;
  buttonLabel: string;
  isComplete: boolean;
  onComplete: () => void;
  onAction?: () => void; // Optional action (like "Add Guides")
}

export function ChecklistItem({ 
  title, 
  description, 
  buttonLabel,
  isComplete, 
  onComplete,
  onAction 
}: ChecklistItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  // State 1: Completed (Green)
  if (isComplete) {
    return (
      <Box background="positiveLow" padding="1u" borderRadius="standard">
        <Rows spacing="1u">
          <Text tone="positive" weight="bold">✅ {title} - Checked</Text>
        </Rows>
      </Box>
    );
  }

  // State 2: Active/Open (Instructions visible)
  if (isOpen) {
    return (
      <Box background="neutralLow" padding="1.5u" borderRadius="standard">
        <Rows spacing="2u">
          <Text weight="bold">{title}</Text>
          <Text size="small">{description}</Text>
          
          {onAction && (
            <Button variant="secondary" onClick={onAction} stretch>
              {buttonLabel}
            </Button>
          )}
          
          <Button variant="primary" tone="positive" onClick={onComplete} stretch>
            I have verified this
          </Button>
        </Rows>
      </Box>
    );
  }

  // State 3: Pending (Red Button)
  return (
    <Button 
      variant="primary" 
      tone="critical" 
      onClick={() => setIsOpen(true)} 
      stretch
    >
      🛑 {title}
    </Button>
  );
}