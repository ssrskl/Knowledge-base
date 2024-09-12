import React from "react";
import { MDXProvider } from "@mdx-js/react";
import MDXComponents from "@theme/MDXComponents";
import type { Props } from "@theme/MDXContent";
import { Avatar, Button, Card, Flex, Tag, Typography } from "antd";
import styles from "./style.module.css";

const imgStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
};

export default function MDXContent({ children }: Props): JSX.Element {
  return (
    <>
      <Card
        hoverable
        styles={{
          body: {
            padding: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
        }}
      >
        <Flex align="center">
          <Avatar
            src={"https://avatars.githubusercontent.com/u/18780761?v=4"}
            style={imgStyle}
          />
          <Flex vertical>
            <div
              className={styles.nameStyle}
              onClick={() => {
                window.location.href = "https://github.com/ssrskl";
              }}
            >
              猫颜
            </div>
            <div style={{ fontSize: "14px", marginLeft: "10px" }}>
              全栈工程师
            </div>
            <Flex
              style={{ fontSize: "14px", marginLeft: "10px" }}
              gap="4px 0"
              wrap
            >
              <Tag color="default" style={{ width: "34px" }}></Tag>
            </Flex>
          </Flex>
        </Flex>
      </Card>
      <MDXProvider components={MDXComponents}>{children}</MDXProvider>
    </>
  );
}
