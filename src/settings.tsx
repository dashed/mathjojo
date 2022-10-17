import React, { useEffect, useState } from "react";

import { InlineOptions } from "./styles";

type Props = {
  displaySettings: boolean;
  toggleSettings: () => void;
  displayMode: boolean;
  setDisplayMode: (displayMode: boolean) => void;
};

const Settings = (props: Props) => {
  const { setDisplayMode, displayMode, displaySettings, toggleSettings } =
    props;

  const useDarkModeLocalStorage = localStorage.getItem("useDarkMode") === "1";

  const [hasDarkMode, setDarkMode] = useState(
    document.body.classList.contains("latex-dark") || useDarkModeLocalStorage
  );

  useEffect(() => {
    localStorage.setItem("useDarkMode", hasDarkMode ? "1" : "0");
    if (hasDarkMode) {
      if (!document.body.classList.contains("latex-dark")) {
        document.body.classList.add("latex-dark");
      }
    } else {
      document.body.classList.remove("latex-dark");
    }
  }, [hasDarkMode]);

  if (!displaySettings) {
    return (
      <div key="hide">
        <span>
          <a
            href="#toggle-settings"
            onClick={(event) => {
              event.preventDefault();
              toggleSettings();
            }}
          >
            {displaySettings ? "Hide Settings" : "Show Settings"}
          </a>
        </span>
      </div>
    );
  }

  return (
    <div key="show">
      <span>
        <a
          href="#toggle-settings"
          onClick={(event) => {
            event.preventDefault();
            toggleSettings();
          }}
        >
          {displaySettings ? "Hide Settings" : "Show Settings"}
        </a>
      </span>
      <br />
      <b>Display mode: </b>
      <InlineOptions>
        <a
          href="#enable-displaymode"
          onClick={(event) => {
            event.preventDefault();
            setDisplayMode(true);
          }}
          style={{
            fontWeight: displayMode ? "bold" : "normal",
          }}
        >
          Yes
        </a>
        <a
          href="#disable-displaymode"
          onClick={(event) => {
            event.preventDefault();
            setDisplayMode(false);
          }}
          style={{
            fontWeight: !displayMode ? "bold" : "normal",
          }}
        >
          No
        </a>
      </InlineOptions>
      <br />
      <b>Dark mode: </b>
      <InlineOptions>
        <a
          href="#enable-darkmode"
          onClick={(event) => {
            event.preventDefault();
            setDarkMode(true);
          }}
          style={{
            fontWeight: hasDarkMode ? "bold" : "normal",
          }}
        >
          Yes
        </a>
        <a
          href="#disable-darkmode"
          onClick={(event) => {
            event.preventDefault();
            setDarkMode(false);
          }}
          style={{
            fontWeight: !hasDarkMode ? "bold" : "normal",
          }}
        >
          No
        </a>
      </InlineOptions>
      <div>
        <InlineOptions>
          <small>
            <a
              href="https://github.com/dashed/mathjojo"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </small>
          <small>
            <a
              href="https://katex.org/docs/supported.html"
              target="_blank"
              rel="noreferrer"
            >
              Supported TeX functions
            </a>
          </small>
        </InlineOptions>
      </div>
    </div>
  );
};

export default Settings;
