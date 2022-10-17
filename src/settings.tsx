import React, { useState } from "react";

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

  const [hasDarkMode, setDarkMode] = useState(
    document.body.classList.contains("latex-dark")
  );

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
            if (!hasDarkMode) {
              document.body.classList.add("latex-dark");
              setDarkMode(true);
            }
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
            if (hasDarkMode) {
              document.body.classList.remove("latex-dark");
              setDarkMode(false);
            }
          }}
          style={{
            fontWeight: !hasDarkMode ? "bold" : "normal",
          }}
        >
          No
        </a>
      </InlineOptions>
      <div>
        <small>
          <a
            href="https://github.com/dashed/mathjojo"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </small>
      </div>
    </div>
  );
};

export default Settings;
