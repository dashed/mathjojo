import React from "react";
import styled from "styled-components";
import "latex.css/style.css";
import LZString from "lz-string";
import katex, { KatexOptions } from "katex";
import "katex/dist/katex.css";

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
  value: string;
};

class Sandbox extends React.Component<SandboxProps, SandboxState> {
  textAreaRef: null | React.RefObject<HTMLTextAreaElement> = null;
  state = {
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
        value,
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
    return (
      <div>
        <h3>Cheatsheet</h3>
        <p>
          <b>Greek Letters</b>
          <br />
          {LOWER_CASE_GREEK_LETTERS.map((letter, index) => {
            const isLast = index === LOWER_CASE_GREEK_LETTERS.length - 1;
            return (
              <React.Fragment>
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
              <React.Fragment>
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
              <React.Fragment>
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
        </p>
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
            katexOptions={{ displayMode: true }}
            beforeRender={() => {
              if ("URLSearchParams" in window) {
                const compressedValue = compressString(value);
                const searchParams = new URLSearchParams(
                  window.location.search
                );
                searchParams.set("v", compressedValue);
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
    const { source } = this.props;
    if (prevProps.source !== source) {
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

export default App;
