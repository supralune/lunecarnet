# 将 Lunecarnet 作为 Git 依赖使用

Lunecarnet 既可以作为 GitHub Template 复制，也可以作为可版本化的 Astro 主题依赖使用。依赖模式适合希望长期跟随上游组件、响应式和样式改进的个人站。

## 安装

仓库发布版本 tag 后，在个人站中安装固定版本：

```bash
npm install github:supralune/lunecarnet#v0.2.0
```

`package.json` 会包含：

```json
{
  "dependencies": {
    "@lunecarnet/astro": "github:supralune/lunecarnet#v0.2.0"
  }
}
```

不要在正式站中跟随 `#main`。固定 tag 可以让构建可复现，并允许你主动决定升级时间。

## 配置构建模式

单独使用博客或学术模板时不需要声明构建模式，页面默认使用根级路由。只有在同一个站点同时提供两套模板时，才需要在 `astro.config.mjs` 中声明 `both`：

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://example.com",
  output: "static",
  trailingSlash: "always",
  vite: {
    define: {
      "import.meta.env.SITE_MODE": JSON.stringify("both")
    }
  }
});
```

## 把个人数据留在个人站

组件不会读取 Lunecarnet 仓库中的示例身份信息。个人站创建自己的配置：

```ts
// src/config/site.ts
import { defineBlogConfig } from "@lunecarnet/astro";

export default defineBlogConfig({
  showEditingGuides: false,
  identity: {
    name: "Your Name",
    initials: "YN",
    email: "you@example.com",
    github: "https://github.com/your-name",
    location: "City, Country",
    avatar: "/avatar.jpg"
  },
  blog: {
    title: "My Notes",
    description: "Writing about research and making.",
    language: "en",
    foundedYear: 2026,
    hero: "Notes worth keeping.",
    intro: "Essays, tutorials, and project logs.",
    about: "A small personal archive.",
    writingPurpose: "I write to clarify what I learn.",
    coverage: "Research, software, and books.",
    authorBio: "A short public biography.",
    contactNote: "Email is the best way to reach me.",
    nav: [
      { key: "home", label: "Home", href: "/" },
      { key: "archive", label: "Archive", href: "/archive/" },
      { key: "categories", label: "Categories", href: "/categories/" },
      { key: "about", label: "About", href: "/about/" }
    ]
  }
});
```

学术站使用 `defineAcademicConfig()`；类型会检查 identity、论文、项目和动态数据是否完整。`academic.longBio` 同时接受单个字符串和字符串数组，多项会渲染为多个段落。

学术首页的主要区块可以独立开关：

```ts
export default defineAcademicConfig({
  // identity、academic 和内容数组……
  homeSections: {
    publications: true,
    projects: true,
    about: true,
    news: false
  }
});
```

区块只有在开关未关闭且存在内容时才会渲染。Education、Honors 和 Service 为空时也会自动隐藏。

About 页面的 Research Interests 使用独立的结构化记录；`academic.topics` 则继续作为首页和侧栏的短标签：

```ts
academic: {
  // 其他字段……
  topics: ["Autonomous Driving", "Reinforcement Learning"],
  researchInterests: [
    {
      title: "End-to-End Autonomous Driving",
      description: "Unified driving models that integrate perception, prediction, planning, and control."
    },
    {
      title: "Post-Training for Driving Models",
      description: "Post-training strategies for improving robustness and generalization."
    }
  ]
}
```

未提供 `researchInterests` 或数组为空时，About 页面不会渲染该区块。

## 页面只保留薄入口

```astro
---
// src/pages/index.astro
import { BlogHomePage, getPublishedPosts } from "@lunecarnet/astro";
import site from "../config/site";

const posts = await getPublishedPosts();
---

<BlogHomePage posts={posts} {...site}>
  <style is:inline slot="head">
    :root {
      --lc-color-accent: #6e5a9b;
      --lc-site-width: 1180px;
    }

    :root[data-theme="dark"] {
      --lc-color-accent: #b6a5df;
    }
  </style>
</BlogHomePage>
```

其他页面同样使用完整页面组件，例如 `BlogArchivePage`、`BlogCategoriesPage`、`BlogSearchPage`、`BlogAboutPage`、`AcademicPublicationsPage`、`AcademicProjectsPage` 和 `AcademicAboutPage`。个人站仍然拥有 URL 文件，但不再复制页面结构。

博客仍需在个人站定义名为 `posts` 的 Astro content collection。Schema 可以直接从主题导入，Markdown 永远保留在个人站：

```ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { postSchema } from "@lunecarnet/astro/content";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  schema: postSchema
});

export const collections = { posts };
```

## 界面语言

`blog.language` 或 `academic.language` 以 `zh` 开头时，模板自动使用内置中文界面；其他语言默认使用英文。只需覆盖个别文案时，在站点配置中添加 `messages`：

```ts
export default defineBlogConfig({
  // identity、blog 等配置……
  messages: {
    latestNotes: "最近更新",
    readArticle: "继续阅读"
  }
});
```

## 不修改模板也能扩展页面

完整页面组件提供以下命名插槽：

- `head`：额外 meta、验证标签和样式覆盖；由 `BaseLayout` 提供。
- `header-actions`：语言切换、额外社交入口等。
- `after-hero`：Hero 后的个人区块。
- `sidebar`：在默认侧栏末尾追加内容。
- `footer-extra`：追加 Footer 内容。
- 默认插槽：在首页默认区块后追加内容。

样式优先覆盖 `--lc-*` 变量。不要复制或直接修改依赖中的 `global.css`，否则会重新产生两份样式维护成本。公开变量位于 `@lunecarnet/astro/tokens.css`。组件样式位于 `lunecarnet` cascade layer 中，个人站未分层的样式可以稳定覆盖它，而不需要堆叠高优先级选择器。

## 升级

模板仓库发布新 tag 后，将依赖版本从例如 `v0.1.0` 改为 `v0.2.0`，然后运行：

```bash
npm install
npm test
```

补丁和次版本应保持现有 Props、插槽和 `--lc-*` token 兼容；需要迁移的变更应只进入主版本。
