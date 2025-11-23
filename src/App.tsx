import React, { useState, useCallback, useMemo, useRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import "latex.css/style.css";
import LZString from "lz-string";
import "katex/dist/katex.css";
import CheatSheet from "./cheatsheet";
import Katex from "./katex";
import Settings from "./settings";
const DEFAULT_VALUE = "\\zeta(s) = \\sum_{n=1}^\\infty \\frac{1}{n^s}";

const GlobalStyle = createGlobalStyle`
  .latex-dark {
    textarea {
      color: #f8f9fa;
      background-color: #212529;
    }
  }
`;

function App() {
  return (
    <div>
      <GlobalStyle />
      <h1>MathJojo</h1>
      <Sandbox />
    </div>
  );
}

const Sandbox: React.FC = () => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize state from URL parameters
  const getInitialState = () => {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop: string) => searchParams.get(prop),
    }) as any;

    let initialValue = DEFAULT_VALUE;
    if (params.v) {
      let value = decompressString(params.v, DEFAULT_VALUE);
      if (value.trim() === "" && params.v !== "Q") {
        value = DEFAULT_VALUE;
      }
      initialValue = value;
    }

    const initialDisplayMode = params.displayMode
      ? !(params.displayMode === "0")
      : true;

    return {
      value: initialValue,
      displayMode: initialDisplayMode,
    };
  };

  const initialState = getInitialState();
  const [displayCheatSheet, setDisplayCheatSheet] = useState(true);
  const [displaySettings, setDisplaySettings] = useState(false);
  const [displayMode, setDisplayMode] = useState(initialState.displayMode);
  const [value, setValue] = useState(initialState.value);

  const calculateSmartCursorOffset = useCallback(
    (text: string): { start: number; end: number; isSelection: boolean } => {
      // First, try to find a placeholder like {x}, {a}, {b}, etc.
      // This is a single letter inside braces that we want to select
      const placeholderMatch = text.match(/\{([a-zA-Z])\}/);
      if (placeholderMatch && placeholderMatch.index !== undefined) {
        const start = placeholderMatch.index + 1; // Position after '{'
        return {
          start,
          end: start + placeholderMatch[1].length,
          isSelection: true,
        };
      }

      // Try to find empty braces {} and position cursor inside
      const emptyBracesIndex = text.indexOf("{}");
      if (emptyBracesIndex !== -1) {
        return {
          start: emptyBracesIndex + 1, // Position after '{'
          end: emptyBracesIndex + 1,
          isSelection: false,
        };
      }

      // Try to find & (useful for matrices and alignments)
      const ampersandIndex = text.indexOf("&");
      if (ampersandIndex !== -1) {
        return {
          start: ampersandIndex,
          end: ampersandIndex,
          isSelection: false,
        };
      }

      // Try to find $$ (display math delimiters)
      const dollarIndex = text.indexOf("$$");
      if (dollarIndex !== -1) {
        return {
          start: dollarIndex,
          end: dollarIndex,
          isSelection: false,
        };
      }

      // Default: position at end of inserted text
      return {
        start: text.length,
        end: text.length,
        isSelection: false,
      };
    },
    []
  );

  const insertSource = useCallback(
    (insertedSource: string) => {
      const element = textAreaRef.current;
      if (!element) {
        return;
      }
      insertedSource = insertedSource.trim();
      const index = element.selectionStart;

      // Smart cursor positioning inspired by mathURL
      // Priority:
      // 1. Find {x}, {a}, {b}, etc. and select the placeholder
      // 2. Find {} empty braces and position inside
      // 3. Find & for matrices/alignments
      // 4. Find $$ for display math
      // 5. Default to end of inserted text
      const cursorOffset = calculateSmartCursorOffset(insertedSource);

      setValue((currentValue) => {
        const newValue =
          currentValue.slice(0, element.selectionStart) +
          String(insertedSource) +
          currentValue.slice(element.selectionEnd, currentValue.length);

        // Use setTimeout to ensure state update completes before focusing
        setTimeout(() => {
          const element = textAreaRef.current;
          if (!element) {
            return;
          }
          element.focus();

          // If we found a placeholder to select, set selection range
          // Otherwise just position cursor
          if (cursorOffset.isSelection) {
            element.setSelectionRange(
              index + cursorOffset.start,
              index + cursorOffset.end
            );
          } else {
            element.setSelectionRange(
              index + cursorOffset.start,
              index + cursorOffset.start
            );
          }
        }, 0);

        return newValue;
      });
    },
    [calculateSmartCursorOffset]
  );

  const toggleCheatSheet = useCallback(() => {
    setDisplayCheatSheet((prev) => !prev);
  }, []);

  const toggleSettings = useCallback(() => {
    setDisplaySettings((prev) => !prev);
  }, []);

  const handleValueChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(event.target.value);
    },
    []
  );

  const beforeRender = useCallback(() => {
    if ("URLSearchParams" in window) {
      const compressedValue = compressString(value.trim());
      const searchParams = new URLSearchParams(window.location.search);

      searchParams.set("v", compressedValue);
      searchParams.set("displayMode", displayMode ? "1" : "0");

      const newRelativePathQuery =
        window.location.pathname + "?" + searchParams.toString();

      window.history.replaceState(null, "", newRelativePathQuery);
    }
  }, [value, displayMode]);

  const katexOptions = useMemo(() => ({ displayMode }), [displayMode]);

  return (
    <div>
      <CheatSheet
        displayCheatSheet={displayCheatSheet}
        insertSource={insertSource}
        toggleCheatSheet={toggleCheatSheet}
      />
      {displayCheatSheet ? <br /> : null}
      <Settings
        displaySettings={displaySettings}
        displayMode={displayMode}
        setDisplayMode={setDisplayMode}
        toggleSettings={toggleSettings}
      />
      <br />
      <TextArea
        ref={textAreaRef}
        rows={5}
        value={value}
        onChange={handleValueChange}
      />
      <br />
      <p>
        <Katex
          source={value}
          katexOptions={katexOptions}
          beforeRender={beforeRender}
        />
      </p>
    </div>
  );
};

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

export default App;
