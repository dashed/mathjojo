import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import QuickInsert from "./quickinsert";

// Mock the Katex component
jest.mock("./katex", () => {
  return function Katex(props: any) {
    return <span data-testid="katex-mock">{props.source}</span>;
  };
});

describe("QuickInsert", () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders a link", () => {
    render(<QuickInsert source="\\alpha" onClick={mockOnClick} />);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#insert");
  });

  test("renders Katex component with source", () => {
    render(<QuickInsert source="\\alpha" onClick={mockOnClick} />);

    const katex = screen.getByTestId("katex-mock");
    expect(katex).toBeInTheDocument();
    expect(katex).toHaveTextContent("\\alpha");
  });

  test("has title attribute with source", () => {
    const source = "\\beta";
    render(<QuickInsert source={source} onClick={mockOnClick} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("title", source);
  });

  test("calls onClick when clicked", () => {
    render(<QuickInsert source="\\gamma" onClick={mockOnClick} />);

    const link = screen.getByRole("link");
    fireEvent.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test("prevents default on click", () => {
    render(<QuickInsert source="\\delta" onClick={mockOnClick} />);

    const link = screen.getByRole("link");
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });

    Object.defineProperty(event, "preventDefault", {
      value: jest.fn(),
      writable: true,
    });

    link.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("works with complex LaTeX source", () => {
    const complexSource = "\\frac{a}{b}";
    render(<QuickInsert source={complexSource} onClick={mockOnClick} />);

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("title", complexSource);

    const katex = screen.getByTestId("katex-mock");
    expect(katex).toHaveTextContent(complexSource);
  });

  test("can be clicked multiple times", () => {
    render(<QuickInsert source="\\pi" onClick={mockOnClick} />);

    const link = screen.getByRole("link");

    fireEvent.click(link);
    fireEvent.click(link);
    fireEvent.click(link);

    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });
});
