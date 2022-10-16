import React from "react";
import styled from "styled-components";
import "latex.css/style.css";
import LZString from "lz-string";

/**
 * TODO:
 * - allow choice of katex
 * - add toolbar
 */

declare global {
  interface Window {
    MathJax: any;
  }
}

const DEFAULT_VALUE = "\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}";

function App() {
  return (
    <div>
      <h1>MathJojo</h1>
      <br />
      <Sandbox />
    </div>
  );
}

type SandboxProps = {};

type SandboxState = {
  value: string;
};

class Sandbox extends React.Component<SandboxProps, SandboxState> {
  previewRef: null | React.RefObject<HTMLParagraphElement> = null;
  _isMounted: boolean = false;
  timeoutID: NodeJS.Timeout | undefined = undefined;

  state = {
    value: DEFAULT_VALUE,
  };

  constructor(props: SandboxProps) {
    super(props);
    this.previewRef = React.createRef<HTMLParagraphElement>();
    this._isMounted = false;
    this.timeoutID = undefined;

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop: string) => searchParams.get(prop),
    }) as any;
    if (params.v) {
      console.log("params.v", params.v);
      let value = decompressString(params.v, DEFAULT_VALUE);
      if (value.trim() === "" && params.v !== "Q") {
        value = DEFAULT_VALUE;
      }
      this.state = {
        value,
      };
      console.log("this.state", this.state);
    }
  }

  componentDidMount() {
    const { value } = this.state;
    this._isMounted = true;
    this.updateMathJax(value);
  }

  componentWillUnmount(): void {
    this._isMounted = false;
    if (this.timeoutID !== undefined) {
      clearTimeout(this.timeoutID);
      this.timeoutID = undefined;
    }
  }

  componentDidUpdate(prevProps: SandboxProps, prevState: SandboxState) {
    const { value } = this.state;

    if (prevState.value !== value) {
      this.updateMathJax(value);
    }
  }

  updateMathJax(value: string) {
    if ("URLSearchParams" in window) {
      const compressedValue = compressString(value);
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("v", compressedValue);
      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();
      window.history.pushState(null, "", newRelativePathQuery);
    }

    const node = this.previewRef?.current;
    if (!this._isMounted) {
      console.log("not mounted");
      return;
    }
    if (!node) {
      console.log("no node");
      return;
    }
    if (
      !(
        window.MathJax &&
        window.MathJax.texReset &&
        window.MathJax.typesetClear &&
        window.MathJax.typesetPromise
      )
    ) {
      if (this.timeoutID !== undefined) {
        console.log("creating timeout");
        // Try again in a second
        this.timeoutID = setTimeout(() => {
          console.log("trying again");
          this.timeoutID = undefined;
          this.updateMathJax(value);
        }, 200);
      } else {
        console.log("already have timeout");
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(() => {
          console.log("trying again");
          this.timeoutID = undefined;
          this.updateMathJax(value);
        }, 200);
      }

      return;
    }

    try {
      // This seems to error on pageload.
      window.MathJax.startup.document.state(0);
    } catch (err) {
      console.error(err);
      // pass
    }

    console.log("updateMathJax");

    window.MathJax.texReset();
    window.MathJax.typesetClear([node]);

    node.innerHTML = `$$${value.trim()}$$`;
    // console.log("node.innerHTML", node.innerHTML);

    window.MathJax.typesetPromise([node])
      .then(() => {
        // console.log("typeset");
      })
      .catch((err: any) => {
        console.error(err);
      });
  }

  render() {
    const { value } = this.state;
    return (
      <div>
        <textarea
          value={value}
          onChange={(event) => {
            this.setState({
              value: event.target.value,
            });
          }}
        />
        <Hr />
        <p ref={this.previewRef} />
      </div>
    );
  }
}

const compressString = (string: string): string =>
  LZString.compressToBase64(string)
    .replace(/\+/g, "-") // Convert '+' to '-'
    .replace(/\//g, "_") // Convert '/' to '_'
    .replace(/=+$/, ""); // Remove ending '='

const decompressString = (string: string, defaultValue: string): string =>
  LZString.decompressFromBase64(
    string
      .replace(/-/g, "+") // Convert '-' to '+'
      .replace(/_/g, "/") // Convert '_' to '/'
  ) ?? defaultValue;

const Hr = styled.hr`
  border: 1px solid black;
`;

export default App;
