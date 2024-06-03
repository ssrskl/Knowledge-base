import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Code Guide",
  tagline: "Dinosaurs are cool",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url: "https://your-docusaurus-site.example.com",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh",
    locales: ["zh"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: "img/docusaurus-social-card.jpg",
    navbar: {
      title: "Code Guide",
      logo: {
        alt: "My Site Logo",
        src: "img/logo.svg",
      },
      items: [
        { to: "/blog", label: "博客", position: "left" },
        {
          type: "docSidebar",
          sidebarId: "FundamentalSidebar",
          position: "left",
          label: "计算机基础",
        },
        {
          type: "docSidebar",
          sidebarId: "JavaSidebar",
          label: "Java",
        },
        {
          type: "docSidebar",
          sidebarId: "ToolsSidebar",
          label: "开发工具",
        },
        {
          type: "docSidebar",
          sidebarId: "AISidebar",
          label: "人工智能",
        },
        {
          type: "dropdown",
          label: "前端",
          items: [
            {
              type: "docSidebar",
              sidebarId: "ReactSidebar",
              label: "React开发",
            },
            {
              type: "docSidebar",
              sidebarId: "ES6Sidebar",
              label: "ES6",
            },
            {
              type: "docSidebar",
              sidebarId: "ConstructSidebar",
              label: "构建工具",
            },
            {
              type: "docSidebar",
              sidebarId: "CaseStudySidebar",
              label: "案例分析",
            },
          ],
        },
        {
          type: "dropdown",
          label: "数据库",
          items: [
            {
              type: "docSidebar",
              sidebarId: "MysqlSidebar",
              label: "mysql",
            },
            {
              type: "docSidebar",
              sidebarId: "SqlSidebar",
              label: "sql",
            },
          ],
        },
        {
          type: "dropdown",
          label: "大数据",
          items: [
            {
              type: "docSidebar",
              sidebarId: "MaxwellSidebar",
              label: "Maxwell",
            },
            {
              type: "docSidebar",
              sidebarId: "DataXSidebar",
              label: "DataX",
            },
            {
              type: "docSidebar",
              sidebarId: "FlumeSidebar",
              label: "Flume",
            },
            {
              type: "docSidebar",
              sidebarId: "HadoopSidebar",
              label: "Hadoop",
            },
            {
              type: "docSidebar",
              sidebarId: "HiveSidebar",
              label: "Hive",
            },
            {
              type: "docSidebar",
              sidebarId: "ZookeeperSidebar",
              label: "Zookeeper",
            },
            {
              type: "docSidebar",
              sidebarId: "CoreConceptSidebar",
              label: "核心概念",
            },
            {
              type: "docSidebar",
              sidebarId: "BigDataToolsSidebar",
              label: "大数据工具/脚本",
            },
          ],
        },
        {
          type: "dropdown",
          label: "Python",
          items: [
            {
              type: "docSidebar",
              sidebarId: "EffectivePythonSidebar",
              label: "Effective Python",
            },
          ],
        },
        {
          type: "dropdown",
          label: "算法",
          items: [
            {
              type: "docSidebar",
              sidebarId: "ArraySidebar",
              label: "数组",
            },
          ],
        },
        {
          href: "https://github.com/facebook/docusaurus",
          label: "GitHub",
          position: "right",
        },
        {
          type: "search",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/docusaurus",
            },
            {
              label: "Discord",
              href: "https://discordapp.com/invite/docusaurus",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/docusaurus",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "Blog",
              to: "/blog",
            },
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["bash", "json", "properties", "java"],
    },
  } satisfies Preset.ThemeConfig,

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        hashed: true,
        language: ["en", "zh"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],
};

export default config;
