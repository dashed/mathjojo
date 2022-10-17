import React from "react";
import styled from "styled-components";
import "latex.css/style.css";
import LZString from "lz-string";
import "katex/dist/katex.css";
import CheatSheet from "./cheatsheet";
import Katex from "./katex";

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

  insertSource = (insertedSource: string) => {
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
  };

  render() {
    const { value, displayCheatSheet } = this.state;
    return (
      <div>
        <CheatSheet
          displayCheatSheet={displayCheatSheet}
          insertSource={this.insertSource}
          toggleCheatSheet={() => {
            this.setState((state) => {
              return {
                ...state,
                displayCheatSheet: !state.displayCheatSheet,
              };
            });
          }}
        />
        {this.state.displayCheatSheet ? <br /> : null}
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
          rows={5}
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

const InlineOptions = styled.div`
  display: inline-flex;
  gap: 16px;
`;

export default App;
