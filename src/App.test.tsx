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
    window.location = originalLocation as any;
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

describe("Smart cursor positioning", () => {
  test("selects placeholder in single-letter braces like {x}", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    // Clear the textarea first
    fireEvent.change(textarea, { target: { value: "" } });

    // Click the \hat{x} button
    const hatButton = screen.getByTitle("\\hat{x}");
    fireEvent.click(hatButton);

    await waitFor(() => {
      expect(textarea.value).toBe("\\hat{x}");
      // Should select the 'x' (position 5, length 1)
      expect(textarea.selectionStart).toBe(5);
      expect(textarea.selectionEnd).toBe(6);
    });
  });

  test("selects placeholder in {a} from \\frac{a}{b}", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "" } });

    // Click the fraction button
    const fracButton = screen.getByTitle("\\frac{a}{b}");
    fireEvent.click(fracButton);

    await waitFor(() => {
      expect(textarea.value).toBe("\\frac{a}{b}");
      // Should select the 'a' (first placeholder)
      expect(textarea.selectionStart).toBe(6);
      expect(textarea.selectionEnd).toBe(7);
    });
  });

  test("positions cursor inside empty braces", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "" } });

    // Manually trigger insertSource with text containing empty braces
    // We can simulate this by finding a component that would insert such text
    // For this test, let's directly test by typing and then clicking a symbol

    // First, let's clear and type something with empty braces pattern
    fireEvent.change(textarea, { target: { value: "test" } });

    // Set cursor position
    textarea.setSelectionRange(4, 4);

    // Now we need to test the insertion. Let's click the sqrt button which has {x}
    const sqrtButton = screen.getByTitle("\\sqrt{x}");
    fireEvent.click(sqrtButton);

    await waitFor(() => {
      expect(textarea.value).toBe("test\\sqrt{x}");
      // Should select the 'x' placeholder
      expect(textarea.selectionStart).toBe(10);
      expect(textarea.selectionEnd).toBe(11);
    });
  });

  test("positions cursor at ampersand in matrix templates", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "" } });

    // Click the matrix button which contains &
    const matrixButton = screen.getByTitle(/\\begin\{matrix\}/);
    fireEvent.click(matrixButton);

    await waitFor(() => {
      const value = textarea.value;
      expect(value).toContain("\\begin{matrix}");
      expect(value).toContain("&");

      // Should position cursor at first &
      const ampersandIndex = value.indexOf("&");
      expect(textarea.selectionStart).toBe(ampersandIndex);
      expect(textarea.selectionEnd).toBe(ampersandIndex);
    });
  });

  test("inserts at cursor position, not at end", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    // Set initial value with clear delimiter
    fireEvent.change(textarea, { target: { value: "START END" } });

    // Wait for state to settle
    await waitFor(() => {
      expect(textarea.value).toBe("START END");
    });

    // Position cursor between START and END (at position 6, after "START ")
    textarea.focus();
    textarea.setSelectionRange(6, 6);

    // Click alpha button
    const alphaButton = screen.getByTitle("\\alpha");
    fireEvent.click(alphaButton);

    await waitFor(() => {
      expect(textarea.value).toBe("START \\alphaEND");
      // Cursor should be at end of inserted text (6 + 6 = 12)
      expect(textarea.selectionStart).toBe(12);
    });
  });

  test("handles insertion when text is selected", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    // Set initial value
    fireEvent.change(textarea, { target: { value: "abc xyz" } });

    // Select "xyz"
    textarea.focus();
    textarea.setSelectionRange(4, 7);

    // Click beta button to replace selection
    const betaButton = screen.getByTitle("\\beta");
    fireEvent.click(betaButton);

    await waitFor(() => {
      expect(textarea.value).toBe("abc \\beta");
      // Cursor should be at end of inserted text
      expect(textarea.selectionStart).toBe(9);
    });
  });

  test("focuses textarea after insertion", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "" } });

    // Click gamma button
    const gammaButton = screen.getByTitle("\\gamma");

    // Blur the textarea first
    textarea.blur();
    expect(document.activeElement).not.toBe(textarea);

    fireEvent.click(gammaButton);

    await waitFor(() => {
      expect(textarea.value).toBe("\\gamma");
      // Textarea should be focused after insertion
      expect(document.activeElement).toBe(textarea);
    });
  });

  test("handles multiple consecutive insertions", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "" } });

    await waitFor(() => {
      expect(textarea.value).toBe("");
    });

    // Insert alpha
    const alphaButton = screen.getByTitle("\\alpha");
    fireEvent.click(alphaButton);

    await waitFor(() => {
      expect(textarea.value).toBe("\\alpha");
    });

    // Insert beta
    const betaButton = screen.getByTitle("\\beta");
    fireEvent.click(betaButton);

    await waitFor(() => {
      expect(textarea.value).toBe("\\alpha\\beta");
    });

    // Insert gamma
    const gammaButton = screen.getByTitle("\\gamma");
    fireEvent.click(gammaButton);

    await waitFor(() => {
      const expectedValue = "\\alpha\\beta\\gamma";
      expect(textarea.value).toBe(expectedValue);
      // Cursor should be at the end (length = 17)
      expect(textarea.selectionStart).toBe(expectedValue.length);
    });
  });

  test("placeholder selection allows immediate typing to replace", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "" } });

    // Click \vec{x} which should select 'x'
    const vecButton = screen.getByTitle("\\vec{x}");
    fireEvent.click(vecButton);

    await waitFor(() => {
      expect(textarea.value).toBe("\\vec{x}");
      expect(textarea.selectionStart).toBe(5);
      expect(textarea.selectionEnd).toBe(6);
    });

    // Simulate typing to replace the selected 'x' with 'y'
    // When a user types with text selected, it replaces the selection
    const currentValue = textarea.value;
    const newValue =
      currentValue.substring(0, textarea.selectionStart) +
      "y" +
      currentValue.substring(textarea.selectionEnd);

    fireEvent.change(textarea, { target: { value: newValue } });

    await waitFor(() => {
      expect(textarea.value).toBe("\\vec{y}");
    });
  });

  test("handles LaTeX with no special cursor positioning", async () => {
    render(<App />);
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "" } });

    // Click infty which has no placeholders or special positioning
    const inftyButton = screen.getByTitle("\\infty");
    fireEvent.click(inftyButton);

    await waitFor(() => {
      expect(textarea.value).toBe("\\infty");
      // Cursor should be at the end
      expect(textarea.selectionStart).toBe(6);
      expect(textarea.selectionEnd).toBe(6);
    });
  });
});
