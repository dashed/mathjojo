import React from "react";
import QuickInsert from "./quickinsert";
import { InlineOptions } from "./styles";
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
  "\\neg",
];

const ACCENTS = [
  "\\hat{x}",
  "\\vec{x}",
  "\\bar{x}",
  "\\tilde{x}",
  "\\check{x}",
  "\\ddot{x}",
  "\\mathring{x}",
  "\\breve{x}",
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
  `
\\begin{matrix}
  a & b \\\\
  c & d
\\end{matrix}
  `,
];

type Props = {
  displayCheatSheet: boolean;
  insertSource: (source: string) => void;
  toggleCheatSheet: () => void;
};

const CheatSheet = (props: Props) => {
  const { displayCheatSheet, insertSource, toggleCheatSheet } = props;
  if (!displayCheatSheet) {
    return (
      <div key="hide">
        <span>
          <a
            href="#toggle-cheatsheet"
            onClick={(event) => {
              event.preventDefault();
              toggleCheatSheet();
            }}
          >
            {displayCheatSheet ? "Hide Cheatsheet" : "Show Cheatsheet"}
          </a>
        </span>
      </div>
    );
  }
  return (
    <div key="show">
      <span>
        <a
          href="#toggle-cheatsheet"
          onClick={(event) => {
            event.preventDefault();
            toggleCheatSheet();
          }}
        >
          {displayCheatSheet ? "Hide Cheatsheet" : "Show Cheatsheet"}
        </a>
      </span>
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
                insertSource(letter);
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
                insertSource(letter);
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
                insertSource(letter);
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
                insertSource(letter);
              }}
            />
            {isLast ? "" : " "}
          </React.Fragment>
        );
      })}
      <br />
      <b>Layout / Common</b>
      <br />
      <InlineOptions>
        {LAYOUT_COMMON.map((letter, index) => {
          return (
            <React.Fragment key={`${letter}-${index}`}>
              <QuickInsert
                source={letter}
                onClick={() => {
                  insertSource(letter);
                }}
              />
            </React.Fragment>
          );
        })}
      </InlineOptions>
    </div>
  );
};

export default CheatSheet;
