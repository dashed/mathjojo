import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Settings from "./settings";

describe("Settings", () => {
  const defaultProps = {
    displaySettings: false,
    toggleSettings: vi.fn(),
    displayMode: true,
    setDisplayMode: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.className = "";
  });

  describe("when settings are hidden", () => {
    test("shows 'Show Settings' link", () => {
      render(<Settings {...defaultProps} />);
      const link = screen.getByText(/Show Settings/i);
      expect(link).toBeInTheDocument();
    });

    test("calls toggleSettings when clicked", () => {
      render(<Settings {...defaultProps} />);
      const link = screen.getByText(/Show Settings/i);

      fireEvent.click(link);

      expect(defaultProps.toggleSettings).toHaveBeenCalledTimes(1);
    });

    test("does not show settings options", () => {
      render(<Settings {...defaultProps} />);
      const displayModeText = screen.queryByText(/Display mode:/i);
      expect(displayModeText).not.toBeInTheDocument();
    });
  });

  describe("when settings are shown", () => {
    const visibleProps = { ...defaultProps, displaySettings: true };

    test("shows 'Hide Settings' link", () => {
      render(<Settings {...visibleProps} />);
      const link = screen.getByText(/Hide Settings/i);
      expect(link).toBeInTheDocument();
    });

    test("calls toggleSettings when Hide Settings is clicked", () => {
      render(<Settings {...visibleProps} />);
      const link = screen.getByText(/Hide Settings/i);

      fireEvent.click(link);

      expect(defaultProps.toggleSettings).toHaveBeenCalledTimes(1);
    });

    test("shows display mode options", () => {
      render(<Settings {...visibleProps} />);
      const displayModeText = screen.getByText(/Display mode:/i);
      expect(displayModeText).toBeInTheDocument();
    });

    test("shows dark mode options", () => {
      render(<Settings {...visibleProps} />);
      const darkModeText = screen.getByText(/Dark mode:/i);
      expect(darkModeText).toBeInTheDocument();
    });

    test("shows GitHub link", () => {
      render(<Settings {...visibleProps} />);
      const githubLink = screen.getByText(/GitHub/i);
      expect(githubLink).toBeInTheDocument();
      expect(githubLink).toHaveAttribute(
        "href",
        "https://github.com/dashed/mathjojo"
      );
    });

    test("shows Supported TeX functions link", () => {
      render(<Settings {...visibleProps} />);
      const texLink = screen.getByText(/Supported TeX functions/i);
      expect(texLink).toBeInTheDocument();
      expect(texLink).toHaveAttribute(
        "href",
        "https://katex.org/docs/supported.html"
      );
    });
  });

  describe("display mode", () => {
    const visibleProps = { ...defaultProps, displaySettings: true };

    test("highlights 'Yes' when displayMode is true", () => {
      render(<Settings {...visibleProps} displayMode={true} />);

      // Find the Yes link for display mode (not dark mode)
      const displayModeYes = Array.from(
        screen.getAllByRole("link", { name: /Yes/i })
      ).find((el) => el.getAttribute("href") === "#enable-displaymode");

      expect(displayModeYes).toHaveStyle({ fontWeight: "bold" });
    });

    test("highlights 'No' when displayMode is false", () => {
      render(<Settings {...visibleProps} displayMode={false} />);

      const displayModeNo = Array.from(
        screen.getAllByRole("link", { name: /No/i })
      ).find((el) => el.getAttribute("href") === "#disable-displaymode");

      expect(displayModeNo).toHaveStyle({ fontWeight: "bold" });
    });

    test("calls setDisplayMode(true) when Yes is clicked", () => {
      render(<Settings {...visibleProps} displayMode={false} />);

      const displayModeYes = Array.from(
        screen.getAllByRole("link", { name: /Yes/i })
      ).find((el) => el.getAttribute("href") === "#enable-displaymode");

      fireEvent.click(displayModeYes!);

      expect(defaultProps.setDisplayMode).toHaveBeenCalledWith(true);
    });

    test("calls setDisplayMode(false) when No is clicked", () => {
      render(<Settings {...visibleProps} displayMode={true} />);

      const displayModeNo = Array.from(
        screen.getAllByRole("link", { name: /No/i })
      ).find((el) => el.getAttribute("href") === "#disable-displaymode");

      fireEvent.click(displayModeNo!);

      expect(defaultProps.setDisplayMode).toHaveBeenCalledWith(false);
    });
  });

  describe("dark mode", () => {
    const visibleProps = { ...defaultProps, displaySettings: true };

    test("initializes dark mode from localStorage", () => {
      localStorage.setItem("useDarkMode", "1");

      render(<Settings {...visibleProps} />);

      expect(document.body.classList.contains("latex-dark")).toBe(true);
    });

    test("adds latex-dark class when dark mode is enabled", () => {
      render(<Settings {...visibleProps} />);

      const darkModeYes = Array.from(
        screen.getAllByRole("link", { name: /Yes/i })
      ).find((el) => el.getAttribute("href") === "#enable-darkmode");

      fireEvent.click(darkModeYes!);

      expect(document.body.classList.contains("latex-dark")).toBe(true);
      expect(localStorage.getItem("useDarkMode")).toBe("1");
    });

    test("removes latex-dark class when dark mode is disabled", () => {
      document.body.classList.add("latex-dark");
      localStorage.setItem("useDarkMode", "1");

      render(<Settings {...visibleProps} />);

      const darkModeNo = Array.from(
        screen.getAllByRole("link", { name: /No/i })
      ).find((el) => el.getAttribute("href") === "#disable-darkmode");

      fireEvent.click(darkModeNo!);

      expect(document.body.classList.contains("latex-dark")).toBe(false);
      expect(localStorage.getItem("useDarkMode")).toBe("0");
    });

    test("persists dark mode preference to localStorage", () => {
      render(<Settings {...visibleProps} />);

      const darkModeYes = Array.from(
        screen.getAllByRole("link", { name: /Yes/i })
      ).find((el) => el.getAttribute("href") === "#enable-darkmode");

      fireEvent.click(darkModeYes!);

      expect(localStorage.getItem("useDarkMode")).toBe("1");
    });
  });
});
