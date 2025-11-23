import React from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import Katex from "./katex";
import katex from "katex";

// Mock katex
vi.mock("katex", () => ({
  default: {
    render: vi.fn(),
  },
}));

describe("Katex", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders span element", () => {
    const { container } = render(<Katex source="x^2" />);
    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
  });

  test("calls katex.render on mount", () => {
    render(<Katex source="x^2 + y^2 = z^2" />);

    expect(katex.render).toHaveBeenCalledTimes(1);
    expect(katex.render).toHaveBeenCalledWith(
      "x^2 + y^2 = z^2",
      expect.any(HTMLElement),
      expect.objectContaining({
        throwOnError: false,
      })
    );
  });

  test("calls katex.render when source changes", () => {
    const { rerender } = render(<Katex source="x^2" />);

    expect(katex.render).toHaveBeenCalledTimes(1);

    rerender(<Katex source="y^2" />);

    expect(katex.render).toHaveBeenCalledTimes(2);
    expect(katex.render).toHaveBeenLastCalledWith(
      "y^2",
      expect.any(HTMLElement),
      expect.objectContaining({
        throwOnError: false,
      })
    );
  });

  test("does not re-render when source is unchanged", () => {
    const { rerender } = render(<Katex source="x^2" />);

    expect(katex.render).toHaveBeenCalledTimes(1);

    rerender(<Katex source="x^2" />);

    expect(katex.render).toHaveBeenCalledTimes(1);
  });

  test("passes katexOptions to katex.render", () => {
    const source = "\\frac{a}{b}";
    render(
      <Katex
        source={source}
        katexOptions={{ displayMode: true, fleqn: true }}
      />
    );

    expect(katex.render).toHaveBeenCalledWith(
      source,
      expect.any(HTMLElement),
      expect.objectContaining({
        throwOnError: false,
        displayMode: true,
        fleqn: true,
      })
    );
  });

  test("re-renders when katexOptions change", () => {
    const { rerender } = render(
      <Katex source="x^2" katexOptions={{ displayMode: true }} />
    );

    expect(katex.render).toHaveBeenCalledTimes(1);

    rerender(<Katex source="x^2" katexOptions={{ displayMode: false }} />);

    expect(katex.render).toHaveBeenCalledTimes(2);
  });

  test("calls beforeRender callback if provided", () => {
    const beforeRender = vi.fn();

    render(<Katex source="x^2" beforeRender={beforeRender} />);

    expect(beforeRender).toHaveBeenCalledTimes(1);
  });

  test("calls beforeRender before katex.render", () => {
    const callOrder: string[] = [];

    const beforeRender = vi.fn(() => {
      callOrder.push("beforeRender");
    });

    vi.mocked(katex.render).mockImplementation(() => {
      callOrder.push("katex.render");
    });

    render(<Katex source="x^2" beforeRender={beforeRender} />);

    expect(callOrder).toEqual(["beforeRender", "katex.render"]);
  });
});
