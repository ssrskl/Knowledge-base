import React from "react";
import Footer from "@theme-original/Footer";
import type FooterType from "@theme/Footer";
import type { WrapperProps } from "@docusaurus/types";

type Props = WrapperProps<typeof FooterType>;

export default function FooterWrapper(props: Props): JSX.Element {
  return (
    <>
      <div style={{ background: "#303846" }}>
        <img
          src="/img/shapedivider-waves-opacity.svg"
          style={{ width: "100%" }}
        />
      </div>
      <Footer {...props} />
    </>
  );
}
