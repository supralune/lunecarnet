import { defineBlogConfig } from "@lunecarnet/astro";

export default defineBlogConfig({
  identity: {
    name: "测试作者",
    initials: "测",
    email: "author@example.com"
  },
  blog: {
    title: "独立博客",
    description: "用于验证安装包边界的下游站点。",
    language: "zh-CN",
    foundedYear: 2026,
    hero: "只维护内容，不复制主题。",
    intro: "这是一个真实安装打包产物的测试站点。",
    about: "关于博客。",
    writingPurpose: "记录和分享。",
    coverage: "研究与开发。",
    authorBio: "个人简介。",
    contactNote: "欢迎通过邮件联系。",
    nav: [{ key: "home", label: "首页", href: "/" }]
  },
  messages: { latestNotes: "最新更新" }
});
