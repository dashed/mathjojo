import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CheatSheet from "./cheatsheet";

// Mock the QuickInsert component
vi.mock("./quickinsert", () => {
  return {
    default: function QuickInsert(props: any) {
      return (
        <a
          href="#insert"
          onClick={(e) => {
            e.preventDefault();
            props.onClick();
          }}
          data-testid={`quick-insert-${props.source}`}
        >
          {props.source}
        </a>
      );
    },
  };
});

describe("CheatSheet", () => {
  const defaultProps = {
    displayCheatSheet: false,
    insertSource: vi.fn(),
    toggleCheatSheet: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when cheatsheet is hidden", () => {
    test("shows 'Show Cheatsheet' link", () => {
      render(<CheatSheet {...defaultProps} />);
      const link = screen.getByText(/Show Cheatsheet/i);
      expect(link).toBeInTheDocument();
    });

    test("calls toggleCheatSheet when clicked", () => {
      render(<CheatSheet {...defaultProps} />);
      const link = screen.getByText(/Show Cheatsheet/i);

      fireEvent.click(link);

      expect(defaultProps.toggleCheatSheet).toHaveBeenCalledTimes(1);
    });

    test("does not show greek letters", () => {
      render(<CheatSheet {...defaultProps} />);
      const greekLettersText = screen.queryByText(/Greek Letters/i);
      expect(greekLettersText).not.toBeInTheDocument();
    });
  });

  describe("when cheatsheet is shown", () => {
    const visibleProps = { ...defaultProps, displayCheatSheet: true };

    test("shows 'Hide Cheatsheet' link", () => {
      render(<CheatSheet {...visibleProps} />);
      const link = screen.getByText(/Hide Cheatsheet/i);
      expect(link).toBeInTheDocument();
    });

    test("calls toggleCheatSheet when Hide Cheatsheet is clicked", () => {
      render(<CheatSheet {...visibleProps} />);
      const link = screen.getByText(/Hide Cheatsheet/i);

      fireEvent.click(link);

      expect(defaultProps.toggleCheatSheet).toHaveBeenCalledTimes(1);
    });

    test("shows Greek Letters section", () => {
      render(<CheatSheet {...visibleProps} />);
      const greekLettersText = screen.getByText(/Greek Letters/i);
      expect(greekLettersText).toBeInTheDocument();
    });

    test("shows Symbols section", () => {
      render(<CheatSheet {...visibleProps} />);
      const symbolsText = screen.getByText(/Symbols/i);
      expect(symbolsText).toBeInTheDocument();
    });

    test("shows Accents section", () => {
      render(<CheatSheet {...visibleProps} />);
      const accentsText = screen.getByText(/Accents/i);
      expect(accentsText).toBeInTheDocument();
    });

    test("shows Layout / Common section", () => {
      render(<CheatSheet {...visibleProps} />);
      const layoutText = screen.getByText(/Layout \/ Common/i);
      expect(layoutText).toBeInTheDocument();
    });

    test("renders greek letter quick inserts", () => {
      render(<CheatSheet {...visibleProps} />);

      const alphaInsert = screen.getByTestId("quick-insert-\\alpha");
      expect(alphaInsert).toBeInTheDocument();

      const betaInsert = screen.getByTestId("quick-insert-\\beta");
      expect(betaInsert).toBeInTheDocument();
    });

    test("calls insertSource when a greek letter is clicked", () => {
      render(<CheatSheet {...visibleProps} />);

      const alphaInsert = screen.getByTestId("quick-insert-\\alpha");
      fireEvent.click(alphaInsert);

      expect(defaultProps.insertSource).toHaveBeenCalledWith("\\alpha");
    });

    test("renders symbol quick inserts", () => {
      render(<CheatSheet {...visibleProps} />);

      const infinityInsert = screen.getByTestId("quick-insert-\\infty");
      expect(infinityInsert).toBeInTheDocument();
    });

    test("calls insertSource when a symbol is clicked", () => {
      render(<CheatSheet {...visibleProps} />);

      const infinityInsert = screen.getByTestId("quick-insert-\\infty");
      fireEvent.click(infinityInsert);

      expect(defaultProps.insertSource).toHaveBeenCalledWith("\\infty");
    });

    test("renders accent quick inserts", () => {
      render(<CheatSheet {...visibleProps} />);

      const hatInsert = screen.getByTestId("quick-insert-\\hat{x}");
      expect(hatInsert).toBeInTheDocument();
    });

    test("calls insertSource when an accent is clicked", () => {
      render(<CheatSheet {...visibleProps} />);

      const hatInsert = screen.getByTestId("quick-insert-\\hat{x}");
      fireEvent.click(hatInsert);

      expect(defaultProps.insertSource).toHaveBeenCalledWith("\\hat{x}");
    });

    test("renders layout/common quick inserts", () => {
      render(<CheatSheet {...visibleProps} />);

      const fracInsert = screen.getByTestId("quick-insert-\\frac{a}{b}");
      expect(fracInsert).toBeInTheDocument();
    });

    test("calls insertSource when a layout item is clicked", () => {
      render(<CheatSheet {...visibleProps} />);

      const fracInsert = screen.getByTestId("quick-insert-\\frac{a}{b}");
      fireEvent.click(fracInsert);

      expect(defaultProps.insertSource).toHaveBeenCalledWith("\\frac{a}{b}");
    });

    test("renders uppercase greek letters", () => {
      render(<CheatSheet {...visibleProps} />);

      const gammaInsert = screen.getByTestId("quick-insert-\\Gamma");
      expect(gammaInsert).toBeInTheDocument();
    });

    test("calls insertSource when an uppercase greek letter is clicked", () => {
      render(<CheatSheet {...visibleProps} />);

      const gammaInsert = screen.getByTestId("quick-insert-\\Gamma");
      fireEvent.click(gammaInsert);

      expect(defaultProps.insertSource).toHaveBeenCalledWith("\\Gamma");
    });
  });
});
