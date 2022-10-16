import React from "react";
import styled from "styled-components";
import "latex.css/style.css";
import { useState } from "react";

/**
 * TODO:
 * - allow choice of katex
 * - add toolbar
 * - sharable URLs
 */

declare global {
  interface Window {
    MathJax: any;
  }
}

function App() {
  const [value, setValue] = useState<string>(
    "\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}"
  );
  return (
    <div>
      <h1>MathJojo</h1>
      <br />
      <Sandbox value={value} setValue={setValue} />
    </div>
  );
}

type SandboxProps = {
  value: string;
  setValue: React.Dispatch<string>;
};

class Sandbox extends React.Component<SandboxProps> {
  previewRef: null | React.RefObject<HTMLParagraphElement> = null;
  _isMounted: boolean = false;
  timeoutID: NodeJS.Timeout | undefined = undefined;

  constructor(props: SandboxProps) {
    super(props);
    this.previewRef = React.createRef<HTMLParagraphElement>();
    this._isMounted = false;
    this.timeoutID = undefined;
  }

  componentDidMount() {
    const { value } = this.props;
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

  componentDidUpdate(prevProps: SandboxProps) {
    const { value } = this.props;

    if (prevProps.value !== value) {
      this.updateMathJax(value);
    }
  }

  updateMathJax(value: string) {
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
        }, 1000);
      } else {
        console.log("already have timeout");
        clearTimeout(this.timeoutID);
        this.timeoutID = setTimeout(() => {
          console.log("trying again");
          this.timeoutID = undefined;
          this.updateMathJax(value);
        }, 1000);
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
    const { value, setValue } = this.props;
    return (
      <div>
        <textarea
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
        <Hr />
        <p ref={this.previewRef} />
      </div>
    );
  }
}

const Hr = styled.hr`
  border: 1px solid black;
`;

export default App;
