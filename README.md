<div align="right">

**简体中文** | [English](./README.en.md)

</div>

# 🧠 AI 心理健康助手

基于 **Vue 3 + Vite + Element Plus** 的心理健康自助平台，集成 **AI 流式心理对话（SSE）**、情绪日记、心理知识库等功能，提供用户端与管理端双角色界面。

> 纯前端学习项目，后端为公共测试服务，开箱即可运行体验。

---

## ✨ 功能特性

### 用户端（前台 `/front`）
| 模块 | 说明 |
|------|------|
| 💬 **AI 心理咨询** | 基于 SSE 的流式对话，逐字渲染 AI 回复（支持 Markdown）；临时会话懒创建、多会话切换、会话删除；对话后展示会话情绪分析结果 |
| 📔 **情绪日记** | 1-10 分情绪评分（分级文案 + 分级配色）、8 种主要情绪选择、触发因素与感想记录、睡眠/压力生活指标，支持重置与重复提交防护 |
| 📚 **心理知识库** | 文章分页列表、热门推荐栏（按阅读量排序）、文章详情（富文本正文、标签、作者信息）、单/双行文本溢出省略 |
| 🔐 **登录注册** | Token + localStorage 持久化，按用户角色自动分流 |

### 管理端（后台 `/back`）
| 模块 | 说明 |
|------|------|
| 📊 **数据分析** | ECharts 可视化看板 |
| 📄 **知识文章管理** | 文章增删改查（wangEditor 富文本）、表格搜索 |
| 🗂 **咨询记录 / 情感日志** | 用户会话与日记数据管理 |

---

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 核心框架 | Vue 3.5（Composition API + `<script setup>`） |
| 构建工具 | Vite 8 |
| UI 组件库 | Element Plus 2.13 + `@element-plus/icons-vue` |
| 状态管理 | Pinia 3 + pinia-persistedstate-plugin（持久化） |
| 路由 | Vue Router 4（History 模式 + 角色路由守卫） |
| 网络请求 | Axios（统一封装 + 响应拦截器） |
| AI 流式对话 | @microsoft/fetch-event-source（POST 方式 SSE） |
| 图表 | ECharts 6 |
| 富文本 | wangEditor 5 |
| 样式 | SCSS（嵌套 + scoped） |
| 自动导入 | unplugin-auto-import / unplugin-vue-components / unplugin-icons |

---

## 🚀 快速开始

### 环境要求
- **Node.js ≥ 20.19**（或 ≥ 22.12，Vite 8 要求）
- npm / pnpm / yarn 任一包管理器

### 安装与启动

```bash
# 1. 克隆项目
git clone https://github.com/<你的用户名>/ai_mental_health.git
cd ai_mental_health

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev
```

浏览器访问控制台输出的地址（默认 `http://localhost:5173` ）。

### 生产构建

```bash
npm run build     # 打包产物输出至 dist/
npm run preview   # 本地预览构建产物
```

> 项目已配置 Vite 代理（`/api → http://159.75.169.224:1235/api` ）解决跨域，无需额外配置即可联调。如需替换为自己的后端，修改 `vite.config.js` 中 `server.proxy` 的 `target` 即可。

---

## 📁 项目结构

```text
ai_mental_health/
├── src/
│   ├── api/                    # 接口层（按端拆分）
│   │   ├── frontend.js         # 用户端接口（会话/日记/文章/情绪分析）
│   │   ├── admin.js            # 管理端接口
│   │   └── chatStream.js       # SSE 流式对话（fetch-event-source 封装）
│   ├── assets/                 # 静态资源（图片、全局样式）
│   ├── components/             # 公共组件
│   │   ├── MarkdownRenderer.vue  # AI 消息 Markdown 渲染
│   │   ├── RichTextEditor.vue    # wangEditor 富文本封装
│   │   ├── ArticleDialog.vue     # 文章编辑弹窗
│   │   ├── TableSearch.vue       # 表格搜索
│   │   ├── NavBar.vue / SideBar.vue / PageHead.vue
│   ├── constants/              # 常量（情绪文案映射等）
│   ├── layouts/                # 三套布局：前台 / 后台 / 认证页
│   ├── router/                 # 路由表 + 全局守卫
│   ├── store/                  # Pinia store（admin）
│   ├── utils/
│   │   ├── request.js          # Axios 实例（拦截器自动解包 data.data）
│   │   ├── mapFunction.js      # 纯函数工具
│   │   └── others.js
│   ├── views/
│   │   ├── auth/               # 登录 / 注册
│   │   ├── frontend/           # 用户端页面（咨询/日记/知识库/首页）
│   │   └── backend/            # 管理端页面（看板/文章/记录）
│   ├── App.vue
│   └── main.js
├── vite.config.js              # 代理、自动导入、别名配置
└── package.json
```

---

## 🗺 路由地图

| 路径 | 页面 | 说明 |
|------|------|------|
| `/auth/login` `/auth/register` | 登录 / 注册 | 未登录自动重定向至此 |
| `/front/index` | 首页 | 用户端默认页 |
| `/front/consultation` | AI 咨询 | SSE 流式对话 |
| `/front/emotion` | 情绪日记 | 每日记录 |
| `/front/knowledge` | 知识库 | 文章列表 + 热门推荐 |
| `/front/knowledge/article/:id` | 文章详情 | UUID 参数 |
| `/back/dashboard` | 数据看板 | 管理端默认页 |
| `/back/knowledge` `/back/consultation` `/back/emotion` | 内容管理 | — |

**路由守卫**：`beforeEach` 校验 localStorage 中的 token 与 `userInfo.userType`——`userType: 1`（用户）仅可访问 `/front/**`，`userType: 2`（管理员）仅可访问 `/back/**`，越权自动跳转对应端首页，无效数据清除并回登录页。

---

## 🔑 核心实现说明

### 1. SSE 流式对话
采用 `@microsoft/fetch-event-source` 以 **POST** 发起 SSE（原生 EventSource 只支持 GET）：
POST /api/psychological-chat/stream
Header: { token, Accept: text/event-stream }
Body:   { sessionId, userMessage }

- 服务端逐分片推送 `{ code, data: { content } }`，事件名 `done` 表示结束
- `AbortController` 支持组件卸载/切换会话时中止流
- 业务错误走 `event: error`，网络层错误在 `onerror` 处理

### 2. 请求拦截器
`utils/request.js` 响应拦截器自动剥壳返回 `data.data`，组件内**直接拿到业务数据**（无需再 `.data`）；异常统一在此抛出，由各页面的 try-catch 捕获后用 ElMessage 提示。

### 3. 按需自动导入
Vite 插件自动注册 Element Plus 组件与图标（`unplugin-vue-components`），自动导入 Vue API（`unplugin-auto-import`），类型声明生成在 `src/auto-imports.d.ts` 与 `src/components.d.ts`。

---

## 📌 已知问题与 TODO

- [ ] 会话列表点击后的 sessionId 拼接格式（`session_` 前缀）需与后端进一步核对
- [ ] 聊天错误气泡（`isError`）样式分支已就绪，待接入错误状态写入
- [ ] 情绪日记历史记录查询接口暂未提供（后端仅有 upsert）
- [ ] 管理端知识文章管理页待完善
- [ ] 补充 ESLint + Prettier 统一代码规范

---

## 📄 License

[MIT](LICENSE)