import React from "react";
import Content from "@theme-original/DocItem/Content";
import type ContentType from "@theme/DocItem/Content";
import type { WrapperProps } from "@docusaurus/types";
import Giscus from "@giscus/react";

type Props = WrapperProps<typeof ContentType>;

export default function ContentWrapper(props: Props): JSX.Element {
  return (
    <>
      <Content {...props} />
      <Giscus
        id="comments"
        repo="ssrskl/Knowledge-base"
        repoId="R_kgDOMEPcTQ"
        category="General"
        categoryId="DIC_kwDOMEPcTc4CiB0_"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="light"
        lang="zh-CN"
        loading="lazy"
      />
    </>
  );
}
