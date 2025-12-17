import "@testing-library/jest-dom";
import { TestAppI18nProvider } from "@canva/app-i18n-kit";
import { TestAppUiProvider } from "@canva/app-ui-kit";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { App } from "../app";
import * as canvaDesign from "@canva/design";

// Mock the entire @canva/design module
jest.mock("@canva/design", () => ({
  ...jest.requireActual("@canva/design"),
  getCurrentPageContext: jest.fn(),
  addNativeElement: jest.fn(),
}));

const mockGetCurrentPageContext = canvaDesign.getCurrentPageContext as jest.Mock;
const mockAddNativeElement = canvaDesign.addNativeElement as jest.Mock;

const renderApp = () => {
  return render(
    <TestAppI18nProvider>
      <TestAppUiProvider>
        <App />
      </TestAppUiProvider>
    </TestAppI18nProvider>
  );
};

describe("App Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the setup screen initially", () => {
    renderApp();
    expect(screen.getByText("Printssistant Job Setup")).toBeInTheDocument();
    expect(screen.getByText("Select your target print product to begin preflight checks.")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start Preflight" })).toBeInTheDocument();
  });

  it('should move to the checklist screen on successful size verification', async () => {
    mockGetCurrentPageContext.mockResolvedValue({
      dimensions: { width: 336, height: 192 }, // 3.5" x 2" at 96 PPI
    });

    renderApp();
    
    fireEvent.click(screen.getByRole("button", { name: "Start Preflight" }));

    await screen.findByText("Preflight: Business Card (US)");
    expect(screen.getByText("Preflight: Business Card (US)")).toBeInTheDocument();
    expect(screen.queryByText("Printssistant Job Setup")).not.toBeInTheDocument();
  });

  it('should show a warning on size mismatch and a "Proceed Anyway" button', async () => {
    mockGetCurrentPageContext.mockResolvedValue({
      dimensions: { width: 500, height: 500 },
    });

    renderApp();
    
    fireEvent.click(screen.getByRole("button", { name: "Start Preflight" }));

    await screen.findByText(/Current size/);
    expect(screen.getByText(/does not match/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Proceed Anyway" })).toBeInTheDocument();
  });

  it('should move to checklist screen when "Proceed Anyway" is clicked', async () => {
    mockGetCurrentPageContext.mockResolvedValue({
      dimensions: { width: 500, height: 500 },
    });

    renderApp();
    
    fireEvent.click(screen.getByRole("button", { name: "Start Preflight" }));
    await screen.findByRole("button", { name: "Proceed Anyway" });
    fireEvent.click(screen.getByRole("button", { name: "Proceed Anyway" }));

    await screen.findByText("Preflight: Business Card (US)");
    expect(screen.queryByText(/Current size/)).not.toBeInTheDocument();
  });

  it('should call addNativeElement when "Add Trim/Bleed Guides" is clicked', async () => {
    mockGetCurrentPageContext.mockResolvedValue({
      dimensions: { width: 336, height: 192 },
    });

    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Start Preflight" }));
    await screen.findByText("Preflight: Business Card (US)");
    
    const addGuidesButton = screen.getByRole('button', { name: '🛑 1. View Trim & Bleed' });
    fireEvent.click(addGuidesButton);

    await screen.findByRole('button', { name: 'Add Trim/Bleed Guides'});
    fireEvent.click(screen.getByRole('button', { name: 'Add Trim/Bleed Guides'}));
    
    expect(mockAddNativeElement).toHaveBeenCalledTimes(2);
  });

  it("should update checklist state and show success message", async () => {
    mockGetCurrentPageContext.mockResolvedValue({
      dimensions: { width: 336, height: 192 },
    });

    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Start Preflight" }));
    await screen.findByText("Preflight: Business Card (US)");

    // Complete first item
    const addGuidesToggle = screen.getByRole('button', { name: '🛑 1. View Trim & Bleed' });
    fireEvent.click(addGuidesToggle);
    const addGuidesButton = await screen.findByRole('button', { name: 'Add Trim/Bleed Guides' });
    fireEvent.click(addGuidesButton);
    const verifyGuidesButton = await screen.findByRole('button', { name: 'I have verified this' });
    fireEvent.click(verifyGuidesButton);
    expect(await screen.findByText(/✅ 1. View Trim & Bleed - Checked/)).toBeInTheDocument();
    
    // Complete second item
    const verifyBleedToggle = screen.getByRole('button', { name: '🛑 2. Verify Bleed Extends' });
    fireEvent.click(verifyBleedToggle);
    const verifyBleedButton = await screen.findByRole('button', { name: 'I have verified this' });
    fireEvent.click(verifyBleedButton);
    expect(await screen.findByText(/✅ 2. Verify Bleed Extends - Checked/)).toBeInTheDocument();

    // Complete third item
    const colorCheckToggle = screen.getByRole('button', { name: '🛑 3. Color Reality Check' });
    fireEvent.click(colorCheckToggle);
    const verifyColorButton = await screen.findByRole('button', { name: 'I have verified this' });
    fireEvent.click(verifyColorButton);
    expect(await screen.findByText(/✅ 3. Color Reality Check - Checked/)).toBeInTheDocument();

    // Check for success message
    expect(await screen.findByText("🎉 Ready for Production!")).toBeInTheDocument();
  });

  it('should return to setup screen when "Change Job" is clicked', async () => {
    mockGetCurrentPageContext.mockResolvedValue({
      dimensions: { width: 336, height: 192 },
    });

    renderApp();
    fireEvent.click(screen.getByRole("button", { name: "Start Preflight" }));
    await screen.findByText("Preflight: Business Card (US)");

    fireEvent.click(screen.getByRole("button", { name: "Change Job" }));

    expect(await screen.findByText("Printssistant Job Setup")).toBeInTheDocument();
  });

  it("should have a consistent snapshot", () => {
    const { container } = renderApp();
    expect(container).toMatchSnapshot();
  });
});