import React from "react";

import Katex from "./katex";

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

export default QuickInsert;
