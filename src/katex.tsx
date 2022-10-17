import React from "react";

import katex, { KatexOptions } from "katex";
import shallowequal from "shallowequal";

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

export default Katex;
