# Blogs

> 个人博客系统 —— 基于 [GBlog](https://github.com/fengziye/Gblog) 升级重构，全面迁移至 Vue 3 + TypeScript。

---

## 📌 项目概况

| 项目 | 说明 |
|---|---|
| 框架 | Vue 3 + TypeScript + Vite 4 |
| UI 组件库 | Element Plus 2.x |
| 状态管理 | Pinia 3.x |
| 路由 | Vue Router 4（History 模式） |
| 样式 | Sass + 自定义 CSS 变量 |
| 3D 引擎 | Three.js 0.184 |
| 代码规范 | ESLint + @typescript-eslint |

---

## ✅ 已完成功能

### 核心页面
- **首页**（`/`）— 文章列表、分类筛选、Banner 轮播
- **文章详情**（`/article/:id`）— Markdown 渲染、评论、阅读进度
- **分类**（`/category/:cate`）— 按分类过滤文章列表
- **友链**（`/friend`）— 友情链接展示
- **关于**（`/about`）— 个人简介页

### 3D 展示页（`/text`）
- 基于 Three.js 的 GLB 模型展示
- RoomEnvironment 环境贴图（PBR 材质正确渲染）
- 自动旋转 + 轨道控制（拖拽旋转）
- 加载进度指示 / 加载失败提示
- 性能优化：pixelRatio 上限、PCFShadowMap、按需阴影

### 工程化
- **TypeScript 全量迁移**：`tsconfig.json` + `tsconfig.node.json` 双配置、`moduleResolution: bundler`
- **npm scripts**：`dev` / `build` / `type-check` / `lint`
- **Vite 插件**：自动导入、SVG 图标、Gzip 压缩、`<script setup name>` 支持
- **暗色模式**：Element Plus Dark CSS 变量支持

---

## 🚧 待完善 / 可扩展方向

### 功能
- [ ] SEO 优化 — 完善各页面 `<title>`、`<meta description>`、结构化数据
- [ ] RSS 订阅 — 生成 feed.xml 供 RSS 阅读器订阅
- [ ] 全文搜索 — 接入 Algolia 或本地 FlexSearch
- [ ] 文章目录 TOC — 侧边栏锚点导航
- [ ] 代码高亮主题切换 — 跟随明暗模式
- [ ] 阅读量统计 — 对接后端或第三方统计

### 工程
- [ ] CI/CD — GitHub Actions 自动构建 + 部署到服务器
- [ ] 静态资源 CDN — GLB 模型等大文件迁移至对象存储
- [ ] `.gitignore` 补充 GLB 等大型二进制资源
- [ ] 单元测试 — Vitest 覆盖核心工具函数
- [ ] 路由 meta 规范化 — `/text` 路由 `title` 字段待更新

### 3D 展示页
- [ ] 支持多模型切换展示
- [ ] 添加 HDR 环境贴图（更真实的光照）
- [ ] 鼠标悬停高亮部件
- [ ] 移动端触摸控制优化

---

## 🚀 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查
npm run type-check

# Lint 修复
npm run lint

# 构建生产包
npm run build
```

---

## 📁 目录结构

```
Blogs/
├── public/              # 静态资源（GLB 模型等）
├── src/
│   ├── assets/          # 样式、字体、图片
│   ├── components/      # 公共组件（header、banner、comment 等）
│   ├── router/          # 路由配置
│   ├── store/           # Pinia 状态管理
│   ├── view/            # 页面组件
│   ├── env.d.ts         # 环境类型声明
│   └── main.ts          # 应用入口
├── vite/
│   └── plugins/         # Vite 插件配置
├── tsconfig.json        # 主 TS 配置（src 代码）
├── tsconfig.node.json   # Node 环境 TS 配置（vite.config）
└── vite.config.ts       # Vite 构建配置
```

---

## 📄 License

MIT
