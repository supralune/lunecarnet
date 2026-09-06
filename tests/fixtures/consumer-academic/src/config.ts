import { defineAcademicConfig } from "@lunecarnet/astro";

export default defineAcademicConfig({
  identity: {
    name: "测试学者",
    initials: "学",
    email: "scholar@example.com"
  },
  academic: {
    title: "测试学者",
    description: "独立学术主页消费者测试。",
    language: "zh-CN",
    role: "研究员",
    headline: "研究可维护的知识系统。",
    bio: "这是由打包主题渲染的学术主页。",
    longBio: ["第一段学术简介。", "第二段学术简介。"],
    topics: ["知识系统", "开放研究"],
    researchInterests: [
      { title: "可信知识系统", description: "研究可靠、透明且便于长期维护的知识工具。" },
      { title: "开放研究基础设施", description: "探索可复用的研究工作流与公共基础设施。" }
    ]
  },
  homeSections: { about: false }
});
