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

  constructor(props: SandboxProps) {
    super(props);
    this.previewRef = React.createRef<HTMLParagraphElement>();
  }

  componentDidMount() {
    const { value } = this.props;
    this.updateMathJax(value);
  }

  componentDidUpdate(prevProps: SandboxProps) {
    const { value } = this.props;

    if (prevProps.value !== value) {
      this.updateMathJax(value);
    }
  }

  updateMathJax(value: string) {
    const node = this.previewRef?.current;
    if (!node || !window.MathJax) {
      return;
    }

    if (window.MathJax.startup.document.state) {
      window.MathJax.startup.document.state(0);
    }
    window.MathJax.texReset();
    window.MathJax.typesetClear([node]);

    node.innerHTML = `$$${value.trim()}$$`;
    // console.log("node.innerHTML", node.innerHTML);

    window.MathJax.typesetPromise([node]).then(() => {
      // console.log("typeset");
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
