import React from "react";
import styled from "styled-components";
import "latex.css/style.css";
import LZString from "lz-string";
import katex, { KatexOptions } from "katex";
import "katex/dist/katex.css";
import shallowequal from "shallowequal";

const DEFAULT_VALUE = "\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}";
const LOWER_CASE_GREEK_LETTERS = [
  "\\alpha",
  "\\beta",
  "\\gamma",
  "\\delta",
  "\\epsilon",
  "\\zeta",
  "\\eta",
  "\\theta",
  "\\iota",
  "\\kappa",
  "\\lambda",
  "\\mu",
  "\\nu",
  "\\xi",
  "\\omicron",
  "\\pi",
  "\\rho",
  "\\sigma",
  "\\tau",
  "\\upsilon",
  "\\phi",
  "\\chi",
  "\\psi",
  "\\omega",
];
const UPPER_CASE_GREEK_LETTERS = [
  "\\Alpha",
  "\\Beta",
  "\\Gamma",
  "\\Delta",
  "\\Epsilon",
  "\\Zeta",
  "\\Eta",
  "\\Theta",
  "\\Iota",
  "\\Kappa",
  "\\Lambda",
  "\\Mu",
  "\\Nu",
  "\\Xi",
  "\\Omicron",
  "\\Pi",
  "\\Rho",
  "\\Sigma",
  "\\Tau",
  "\\Upsilon",
  "\\Phi",
  "\\Chi",
  "\\Psi",
  "\\Omega",
];

const SYMBOLS = [
  "\\infty",
  "\\aleph",
  "\\emptyset",
  "\\mathbb{R}",
  "\\mathbb{C}",
  "\\mathbb{Z}",
  "\\in",
  "\\notin",
  "\\forall",
  "\\exists",
  "\\Re",
  "\\Im",
  "\\subset",
  "\\supset",
  "\\subseteq",
  "\\supseteq",
  "\\cap",
  "\\cup",
  "\\wedge",
  "\\vee",
  "\\cdot",

  "\\langle",
  "\\rangle",
  "\\|",
  "\\lceil",
  "\\rceil",
  "\\lfloor",
  "\\rfloor",
  "\\gets",
  "\\to",
  "\\leftarrow",
  "\\rightarrow",
  "\\uparrow",
  "\\Uparrow",
  "\\downarrow",
  "\\Downarrow",
  "\\updownarrow",
  "\\Updownarrow",
  "\\Leftarrow",
  "\\Rightarrow",
  "\\leftrightarrow",
  "\\Leftrightarrow",
  "\\mapsto",
  "\\hookleftarrow",
  "\\leftharpoonup",
  "\\leftharpoondown",
  "\\rightleftharpoons",
  "\\longleftarrow",
  "\\Longleftarrow",
  "\\longrightarrow",
  "\\Longrightarrow",
  "\\longleftrightarrow",
  "\\Longleftrightarrow",
  "\\longmapsto",
  "\\hookrightarrow",
  "\\rightharpoonup",
  "\\rightharpoondown",
  "\\leadsto",
  "\\nearrow",
  "\\searrow",
  "\\swarrow",
  "\\nwarrow",
  "\\surd",
  "\\barwedge",
  "\\veebar",
  "\\odot",
  "\\oplus",
  "\\otimes",
  "\\oslash",
  "\\circledcirc",
  "\\boxdot",
  "\\bigtriangleup",
];

const ACCENTS = [
  "\\hat{x}",
  "\\vec{x}",
  "\\bar{x}",
  "\\~{x}",
  "\\v{x}",
  "\\ddot{x}",
  "\\r{x}",
  "\\u{x}",
  "\\c{x}",
];

const LAYOUT_COMMON = [
  "\\frac{a}{b}",
  "\\sqrt{x}",
  "\\frac{\\partial}{\\partial x}",
  "\\frac{\\text{d}}{\\text{d}x}",
  "\\int_{a}^{b} f(x) \\text{d}x",
  "\\lim_{x \\rightarrow a} f(x)",
  "x = \\left\\{ a | b \\right\\}",
  "\\sum_{i=1}^{k+1}i",
];

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
  displayMode: boolean;
  displayCheatSheet: boolean;
  value: string;
};

class Sandbox extends React.Component<SandboxProps, SandboxState> {
  textAreaRef: null | React.RefObject<HTMLTextAreaElement> = null;
  state = {
    displayCheatSheet: true,
    displayMode: true,
    value: DEFAULT_VALUE,
  };

  constructor(props: SandboxProps) {
    super(props);

    this.textAreaRef = React.createRef<HTMLTextAreaElement>();

    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop: string) => searchParams.get(prop),
    }) as any;
    if (params.v) {
      let value = decompressString(params.v, DEFAULT_VALUE);
      if (value.trim() === "" && params.v !== "Q") {
        value = DEFAULT_VALUE;
      }
      this.state = {
        ...this.state,
        value,
      };
    }

    if (params.displayMode) {
      this.state = {
        ...this.state,
        displayMode: !(params.displayMode === "0"),
      };
    }
  }

  insertSource(insertedSource: string) {
    const element = this.textAreaRef?.current;
    if (!element) {
      return;
    }
    const { value } = this.state;
    const index = element.selectionStart;
    const numOfChars = insertedSource.length;
    this.setState(
      {
        value:
          value.slice(0, element.selectionStart) +
          String(insertedSource) +
          value.slice(element.selectionEnd, value.length),
      },
      () => {
        const element = this.textAreaRef?.current;
        if (!element) {
          return;
        }
        element.focus();
        element.setSelectionRange(index + numOfChars, index + numOfChars);
      }
    );
  }

  render() {
    const { value } = this.state;
    console.log("this.state.displayMode", this.state.displayMode);
    return (
      <div>
        <div>
          <span>Hide Cheatsheet</span>
          <br />
          <b>Greek Letters</b>
          <br />
          {LOWER_CASE_GREEK_LETTERS.map((letter, index) => {
            const isLast = index === LOWER_CASE_GREEK_LETTERS.length - 1;
            return (
              <React.Fragment key={`${letter}-${index}`}>
                <QuickInsert
                  source={letter}
                  onClick={() => {
                    this.insertSource(letter);
                  }}
                />
                {isLast ? "" : " "}
              </React.Fragment>
            );
          })}
          <br />
          {UPPER_CASE_GREEK_LETTERS.map((letter, index) => {
            const isLast = index === UPPER_CASE_GREEK_LETTERS.length - 1;
            return (
              <React.Fragment key={`${letter}-${index}`}>
                <QuickInsert
                  source={letter}
                  onClick={() => {
                    this.insertSource(letter);
                  }}
                />
                {isLast ? "" : " "}
              </React.Fragment>
            );
          })}
          <br />
          <b>Symbols</b>
          <br />
          {SYMBOLS.map((letter, index) => {
            const isLast = index === SYMBOLS.length - 1;
            return (
              <React.Fragment key={`${letter}-${index}`}>
                <QuickInsert
                  source={letter}
                  onClick={() => {
                    this.insertSource(letter);
                  }}
                />
                {isLast ? "" : " "}
              </React.Fragment>
            );
          })}
          <br />
          <b>Accents</b>
          <br />
          {ACCENTS.map((letter, index) => {
            const isLast = index === ACCENTS.length - 1;
            return (
              <React.Fragment key={`${letter}-${index}`}>
                <QuickInsert
                  source={letter}
                  onClick={() => {
                    this.insertSource(letter);
                  }}
                />
                {isLast ? "" : " "}
              </React.Fragment>
            );
          })}
          <br />
          <b>Layout / Common</b>
          <br />
          {LAYOUT_COMMON.map((letter, index) => {
            const isLast = index === LAYOUT_COMMON.length - 1;
            return (
              <React.Fragment key={`${letter}-${index}`}>
                <QuickInsert
                  source={letter}
                  onClick={() => {
                    this.insertSource(letter);
                  }}
                />
                {isLast ? "" : " "}
              </React.Fragment>
            );
          })}
        </div>
        <br />
        <b>Display mode: </b>
        <InlineOptions>
          <a
            href="#enable-displaymode"
            onClick={(event) => {
              event.preventDefault();
              console.log("enable");
              this.setState({
                displayMode: true,
              });
            }}
            style={{
              fontWeight: this.state.displayMode ? "bold" : "normal",
            }}
          >
            Yes
          </a>
          <a
            href="#disable-displaymode"
            onClick={(event) => {
              event.preventDefault();
              console.log("disable");
              this.setState({
                displayMode: false,
              });
            }}
            style={{
              fontWeight: !this.state.displayMode ? "bold" : "normal",
            }}
          >
            No
          </a>
        </InlineOptions>
        <br />
        <TextArea
          ref={this.textAreaRef}
          rows={10}
          value={value}
          onChange={(event) => {
            this.setState({
              value: event.target.value,
            });
          }}
        />
        <br />
        <br />
        <p>
          <Katex
            source={value}
            katexOptions={{ displayMode: this.state.displayMode }}
            beforeRender={() => {
              if ("URLSearchParams" in window) {
                const compressedValue = compressString(value);
                const searchParams = new URLSearchParams(
                  window.location.search
                );

                searchParams.set("v", compressedValue);
                searchParams.set(
                  "displayMode",
                  this.state.displayMode ? "1" : "0"
                );

                const newRelativePathQuery =
                  window.location.pathname + "?" + searchParams.toString();

                window.history.pushState(null, "", newRelativePathQuery);
              }
            }}
          />
        </p>
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

const TextArea = styled.textarea`
  font-family: monospace;
`;

type KatexProps = {
  source: string;
  katexOptions?: KatexOptions;
  beforeRender?: () => void;
};

class Katex extends React.Component<KatexProps> {
  previewRef: null | React.RefObject<HTMLElement> = null;
  constructor(props: KatexProps) {
    super(props);
    this.previewRef = React.createRef<HTMLElement>();
  }

  componentDidMount() {
    const { source } = this.props;
    this.renderKatex(source);
  }

  componentDidUpdate(prevProps: KatexProps) {
    const { source, katexOptions } = this.props;
    if (
      prevProps.source !== source ||
      !shallowequal(katexOptions, prevProps.katexOptions)
    ) {
      this.renderKatex(source);
    }
  }

  renderKatex(value: string) {
    const node = this.previewRef?.current;
    if (!node) {
      return;
    }

    const { beforeRender } = this.props;
    if (beforeRender) {
      beforeRender();
      console.log("this.props.katexOptions", this.props.katexOptions);
    }

    katex.render(value, node, {
      throwOnError: false,
      ...this.props.katexOptions,
    });
  }

  render() {
    return <span ref={this.previewRef} />;
  }
}

type QuickInsertProps = {
  source: string;
  onClick: () => void;
};

const QuickInsert = (props: QuickInsertProps) => {
  const { source, onClick } = props;
  return (
    <a
      href="#insert"
      title={source}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      <Katex source={source} />
    </a>
  );
};

const InlineOptions = styled.div`
  display: inline-flex;
  gap: 16px;
`;

export default App;
