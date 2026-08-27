# Lunecarnet

[English](./README.md) | **简体中文**

Lunecarnet 是一套在同一仓库中提供个人博客与学术主页的 Astro 静态模板。它将编辑式博客与克制的学术档案页统一在一套设计语言下：暖色纸张背景、衬线标题、细分隔线、低饱和蓝色，以及适合长时间阅读的信息密度。

模板不包含参考项目中的个人信息或品牌内容。学术部分采用学科中立的通用占位信息，并通过可开关的编辑指引说明应该在哪里替换内容，可直接作为 GitHub Template Repository 使用。

## 页面预览

以下截图使用浅色主题，并保留了可选的模板编辑指引。

### 博客主页

![Lunecarnet 博客主页浅色主题示例](./docs/screenshots/blog-home.png)

### 学术主页

![Lunecarnet 学术主页浅色主题示例](./docs/screenshots/academic-home.png)

## 主要特性

- 一套共享设计系统下的博客与学术主页双版本
- 响应式桌面、平板和移动端布局
- Markdown 文章、正文目录、标签及上一篇/下一篇
- 自动生成的文章归档和分类页面
- 完全在浏览器本地运行的全文搜索
- RSS、Sitemap、robots、canonical 与文章元数据
- 持久化明暗主题与浏览器主题色同步
- 键盘导航、可见焦点、减少动态效果和移动端触控尺寸支持
- 可选的 GitHub Pages 手动部署、Pull Request 质量检查和路由测试
- 不包含分析追踪、远程字体、数据库或前端框架运行时

## 页面路由

- `/blog/`：博客主页。
- `/blog/archive/`：按年份自动生成的文章归档。
- `/blog/categories/`：根据 Markdown Frontmatter 自动汇总的分类页。
- `/blog/search/`：本地全文搜索。
- `/blog/about/`：博客与作者介绍。
- `/academic/`：学术主页。
- `/academic/publications/`：完整论文与研究成果列表。
- `/academic/projects/`：研究、开源和协作项目。
- `/academic/about/`：个人简介、教育经历、荣誉、学术服务和联系方式。
- `/`：显示 `src/data/site.ts` 中 `defaultVariant` 选择的默认主页。

如果只需要其中一种主页，可将 `showVariantSwitcher` 改为 `false`，隐藏页头的 Blog / Academic 切换器。不需要保留另一套页面时，也可以删除相应路由文件。

## 开始使用

需要 Node.js 22 或更高版本。

```bash
npm ci
npm run dev
```

生成静态构建：

```bash
npm run build
```

构建结果位于 `dist/`。

运行完整质量检查：

```bash
npm test
```

该命令会执行 Astro 类型检查、静态构建，并验证主要路由、搜索页、文章阅读组件、RSS、Sitemap 与 robots 输出。

## 快速配置

1. 使用此模板创建仓库并克隆到本地。
2. 修改 `src/data/site.ts` 中的个人身份、博客和学术信息。
3. 删除 `src/content/posts/` 中的示例文章并添加自己的 Markdown。
4. 填写论文、项目、GitHub、Scholar、ORCID 和 CV 链接。
5. 完成内容替换后，将 `showEditingGuides` 设置为 `false`。
6. 选择 `defaultVariant`，并决定是否保留 `showVariantSwitcher`。
7. 如果使用自定义域名或子路径，按下文说明配置 `SITE_URL` 与 `SITE_BASE`。
8. 执行 `npm test` 后推送到 GitHub。

## 内容配置

主要修改入口是 `src/data/site.ts`：

- `defaultVariant`：根路径默认显示博客还是学术主页。
- `showVariantSwitcher`：是否显示两套模板的切换器。
- `showEditingGuides`：是否显示内容填写指引。
- `identity`：姓名、邮箱、GitHub 和所在机构。
- `blog`：博客标题、主页文案、About 页面各部分、联系说明和导航。
- `academic`：学术简介、研究方向和学术链接。
- `publications`：论文与研究成果。
- `projects`：研究、开源或协作项目。
- `news`：学术动态。
- `education`、`honors`、`service`：教育经历、荣誉与学术服务。

## 论文作者标注

论文作者采用结构化数据，以便主页与 Publications 页面使用一致的标注规则：

```ts
authors: [
  { name: "Your Name", self: true },
  { name: "Coauthor One" },
  { name: "Coauthor Two", corresponding: true }
]
```

- `self: true`：为主页本人姓名添加下划线。
- `corresponding: true`：在通讯作者姓名后添加 `*`。
- 本人同时为通讯作者时，可以同时设置两个字段。
- 作者顺序应与正式论文保持一致。

未填写 URL 的论文链接只会在编辑指引开启时显示为灰色提示，不会生成 `href="#"` 空链接。

博客部分采用开源模板中常见的“自然示例内容 + 独立编辑指引”方式：页面默认展示完整、可读的通用示例，修改说明由 `showEditingGuides` 控制。删除全部示例文章后，首页、归档和分类页会显示有意义的空状态，不会留下空白区域。

## Markdown 文章

在 `src/content/posts/` 中创建文章：

```md
---
title: "Your Note Title"
description: "A short summary used on listing pages"
publishDate: 2026-08-27
category: "Category Name"
tags: ["Astro", "Writing"]
draft: false
featured: false
readingTime: 5
---

Start the article here. Section headings should normally begin at `##`.
```

归档、分类、全文搜索、RSS、Sitemap 和文章详情页都会根据这些文件自动更新。

## 设计与样式

颜色、字体、间距和响应式规则集中在 `src/styles/global.css`。模板使用系统字体，不请求第三方字体，也不依赖必须保留的图片资源。

设计原则和变量说明参见 [`DESIGN.md`](./DESIGN.md)。

## GitHub Pages

仓库包含 `.github/workflows/pages.yml`，但默认仅允许手动触发，避免从模板创建的新仓库自动发布示例内容。如需部署，请先在 GitHub 的 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**，然后进入 **Actions → Deploy to GitHub Pages → Run workflow**。

如果以后希望 `main` 分支的每次更新都自动发布，可在该工作流中添加针对 `main` 的 `push` 触发器。独立的质量检查工作流仍会检查推送和 Pull Request，但不会发布网站。

工作流会自动推导以下两类 GitHub Pages 地址的公开域名和路径：

- 用户主页仓库：`username.github.io`
- 普通项目仓库：`username.github.io/repository-name`

使用上述标准地址时不需要额外配置。若使用自定义域名，请在 **Settings → Secrets and variables → Actions → Variables** 中添加仓库变量：

- `SITE_URL`：公开访问域名，例如 `https://www.example.com`
- `SITE_BASE`：根域名部署填写 `/`；部署在子路径时填写类似 `/notes` 的路径

工作流会把这两个变量传给 Astro，使站内导航、canonical、RSS、Sitemap 和 robots 中的公开地址与实际部署保持一致。

## 项目结构

```text
src/components/       共享组件和两套主页组件
src/content/posts/    Markdown 博客文章
src/data/site.ts      站点内容与模板配置
src/layouts/          HTML、SEO 和页面框架
src/pages/            双主页、内页、文章页和发现文件
src/styles/           共享设计系统与响应式样式
tests/                静态构建和路由测试
.github/              工作流、Issue 表单和 PR 模板
```

## 参与贡献

提交修改前请阅读 [`CONTRIBUTING.md`](./CONTRIBUTING.md)。Pull Request 会自动执行与本地相同的 `npm test` 质量检查。

## License

[MIT](./LICENSE)
