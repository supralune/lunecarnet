# 将 Lunecarnet 作为 Git 依赖使用

Lunecarnet 既可以作为 GitHub Template 复制，也可以作为可版本化的 Astro 主题依赖使用。依赖模式适合希望长期跟随上游组件、响应式和样式改进的个人站。

## 安装

仓库发布版本 tag 后，在个人站中安装固定版本：

```bash
npm install github:supralune/lunecarnet#v0.1.0
```

`package.json` 会包含：

```json
{
  "dependencies": {
    "@lunecarnet/astro": "github:supralune/lunecarnet#v0.1.0"
  }
}
```

不要在正式站中跟随 `#main`。固定 tag 可以让构建可复现，并允许你主动决定升级时间。

> 当前根仓库保留了示例站的 `build` 脚本，因此 npm 从 Git 安装时会额外构建一次仓库。以后发布到 npm registry 后，这一步不会发生；组件的导入方式不需要改变。

## 配置构建模式

依赖中的路由工具需要知道当前使用博客、学术或组合模式。在个人站的 `astro.config.mjs` 中声明：

```js
import { defineConfig } from "astro/config";

const siteMode = "blog"; // "blog" | "academic" | "both"

export default defineConfig({
  site: "https://example.com",
  output: "static",
  trailingSlash: "always",
  vite: {
    define: {
      "import.meta.env.SITE_MODE": JSON.stringify(siteMode)
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

学术站使用 `defineAcademicConfig()`；类型会检查 identity、论文、项目和动态数据是否完整。

## 页面只保留薄入口

```astro
---
// src/pages/index.astro
import {
  BaseLayout,
  BlogHome,
  getPublishedPosts,
  templatePath
} from "@lunecarnet/astro";
import site from "../config/site";

const posts = await getPublishedPosts();
const { blog } = site;
---

<BaseLayout
  title={`${blog.title} · Blog`}
  description={blog.description}
  lang={blog.language}
  pageClass="blog-page"
  feed={{ title: `${blog.title} RSS`, href: templatePath("blog", "/rss.xml") }}
>
  <style is:inline slot="head">
    :root {
      --lc-color-accent: #6e5a9b;
      --lc-site-width: 1180px;
    }

    :root[data-theme="dark"] {
      --lc-color-accent: #b6a5df;
    }
  </style>
  <BlogHome posts={posts} {...site} />
</BaseLayout>
```

博客仍需在个人站定义名为 `posts` 的 Astro content collection。可以从本仓库的 `src/content.config.ts` 复制初始 schema；Markdown 永远保留在个人站，不进入主题依赖。

## 不修改模板也能扩展页面

高级组件提供以下命名插槽：

- `head`：额外 meta、验证标签和样式覆盖；由 `BaseLayout` 提供。
- `header-actions`：语言切换、额外社交入口等。
- `after-hero`：Hero 后的个人区块。
- `sidebar`：在默认侧栏末尾追加内容。
- `footer-extra`：追加 Footer 内容。
- 默认插槽：在首页默认区块后追加内容。

样式优先覆盖 `--lc-*` 变量。不要复制或直接修改依赖中的 `global.css`，否则会重新产生两份样式维护成本。公开变量位于 `@lunecarnet/astro/tokens.css`。

## 升级

模板仓库发布新 tag 后，将依赖版本从例如 `v0.1.0` 改为 `v0.2.0`，然后运行：

```bash
npm install
npm test
```

补丁和次版本应保持现有 Props、插槽和 `--lc-*` token 兼容；需要迁移的变更应只进入主版本。
