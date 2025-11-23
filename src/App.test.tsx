import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("renders MathJojo heading", () => {
    render(<App />);
    const heading = screen.getByText(/MathJojo/i);
    expect(heading).toBeInTheDocument();
  });

  test("renders with default LaTeX value", () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea.value).toBe(
      "\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}"
    );
  });

  test("updates textarea value on user input", () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "x^2 + y^2 = z^2" } });

    expect(textarea.value).toBe("x^2 + y^2 = z^2");
  });

  test("shows cheatsheet toggle", () => {
    render(<App />);
    const toggleLink = screen.getByText(/Hide Cheatsheet/i);
    expect(toggleLink).toBeInTheDocument();
  });

  test("shows settings toggle", () => {
    render(<App />);
    const toggleLink = screen.getByText(/Show Settings/i);
    expect(toggleLink).toBeInTheDocument();
  });

  test("cheatsheet can be toggled", () => {
    render(<App />);

    // Initially shows "Hide Cheatsheet"
    let toggleLink = screen.getByText(/Hide Cheatsheet/i);
    expect(toggleLink).toBeInTheDocument();

    // Click to hide
    fireEvent.click(toggleLink);

    // Now shows "Show Cheatsheet"
    toggleLink = screen.getByText(/Show Cheatsheet/i);
    expect(toggleLink).toBeInTheDocument();

    // Click to show again
    fireEvent.click(toggleLink);

    // Back to "Hide Cheatsheet"
    toggleLink = screen.getByText(/Hide Cheatsheet/i);
    expect(toggleLink).toBeInTheDocument();
  });

  test("settings can be toggled", () => {
    render(<App />);

    // Initially shows "Show Settings"
    let toggleLink = screen.getByText(/Show Settings/i);
    expect(toggleLink).toBeInTheDocument();

    // Click to show
    fireEvent.click(toggleLink);

    // Now shows "Hide Settings"
    toggleLink = screen.getByText(/Hide Settings/i);
    expect(toggleLink).toBeInTheDocument();
  });
});

describe("URL parameter handling", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Mock window.location
    delete (window as any).location;
    window.location = { ...originalLocation, search: "" } as any;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  test("loads value from URL parameter", () => {
    // Set up URL with compressed value
    window.location.search = "?v=NobAgB";

    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    // The compressed value should be decompressed
    expect(textarea.value).toBeTruthy();
  });

  test("handles empty compressed value", () => {
    window.location.search = "?v=Q";

    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    // Should render empty value when v=Q
    expect(textarea.value).toBe("");
  });

  test("loads displayMode from URL parameter", () => {
    window.location.search = "?displayMode=0";

    render(<App />);

    // Open settings to check display mode
    const toggleLink = screen.getByText(/Show Settings/i);
    fireEvent.click(toggleLink);

    // The "No" option for display mode should be bold (active)
    const displayModeOptions = screen.getAllByText(/^(Yes|No)$/);
    const noOption = displayModeOptions.find(
      (el) =>
        el.textContent === "No" &&
        el.getAttribute("href") === "#disable-displaymode"
    );

    expect(noOption).toHaveStyle({ fontWeight: "bold" });
  });
});
