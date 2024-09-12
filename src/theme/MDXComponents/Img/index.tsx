import React from "react";
import clsx from "clsx";
import type { Props } from "@theme/MDXComponents/Img";

import styles from "./styles.module.css";
import { Button, Image } from "antd";

function transformImgClassName(className?: string): string {
  return clsx(className, styles.img);
}

export default function MDXImg(props: Props): JSX.Element {
  return (
    // eslint-disable-next-line jsx-a11y/alt-text
    <div>
      <Image
        decoding="async"
        loading="lazy"
        {...props}
        className={transformImgClassName(props.className)}
      />
    </div>
  )
}
