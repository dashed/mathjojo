import React, { useRef, useEffect } from "react";

import katex, { KatexOptions } from "katex";
import shallowequal from "shallowequal";

type KatexProps = {
  source: string;
  katexOptions?: KatexOptions;
  beforeRender?: () => void;
};

const Katex: React.FC<KatexProps> = ({ source, katexOptions, beforeRender }) => {
  const previewRef = useRef<HTMLSpanElement>(null);
  const prevSourceRef = useRef<string>();
  const prevKatexOptionsRef = useRef<KatexOptions | undefined>();
  const beforeRenderRef = useRef<(() => void) | undefined>();

  // Keep beforeRender callback up to date without causing re-renders
  beforeRenderRef.current = beforeRender;

  useEffect(() => {
    const node = previewRef.current;
    if (!node) {
      return;
    }

    // Check if source or katexOptions changed (mimics componentDidUpdate logic)
    const shouldRender =
      prevSourceRef.current === undefined ||
      prevSourceRef.current !== source ||
      !shallowequal(katexOptions, prevKatexOptionsRef.current);

    if (shouldRender) {
      if (beforeRenderRef.current) {
        beforeRenderRef.current();
      }

      katex.render(source, node, {
        throwOnError: false,
        ...katexOptions,
      });

      prevSourceRef.current = source;
      prevKatexOptionsRef.current = katexOptions;
    }
  });

  return <span ref={previewRef} />;
};

export default Katex;
