# Bug 修复清单

> 基于代码审查发现的所有问题，按严重程度排序，供逐步修复参考。

---

## 严重问题（Bug，会导致错误行为）

### 1. 响应拦截器逻辑错误 — Token 失效处理失效
- **文件**: `src/utils/request.js` 第 27-50 行
- **问题**: HTTP 200 下 `else` 分支永远不执行，token 失效跳转逻辑完全失效；`data.code==='-1'` 严格比较字符串可能与后端返回的数字 `-1` 不匹配；非 login 路径清除 token 后未 `return`/`reject`，导致返回值不一致
- **建议**: 将 `data.code` 判断移入 `status === 200` 分支内，使用 `==` 或 `String(data.code)` 比较，所有分支均显式 `return`

### 2. `formData` 作为 ref 未通过 `.value` 访问
- **文件**: `src/components/ArticleDialog.vue` 第 215-237 行
- **问题**: `formData` 是 `ref`，但 `removeCover()` 和 `handleCreated()` 中直接访问 `formData.coverImage`、`formData.content`，始终为 `undefined`
- **影响**: 编辑文章时富文本回显失败、移除封面未真正清空数据
- **建议**: 改为 `formData.value.coverImage`、`formData.value.content`

### 3. `el-progress` 属性拼写错误
- **文件**: `src/views/backend/Emotion.vue` 第 92-94 行
- **问题**: `show-text text- striped striped-flow` 中 `text-` 是不完整的无效属性
- **建议**: 移除 `text-`，保留 `show-text`（如需显示文字）及 `striped`/`striped-flow`

### 4. 前端排序破坏分页语义
- **文件**: `src/views/backend/Emotion.vue` 第 209 行
- **问题**: 后端已分页返回数据，前端 `records?.sort((a, b) => b.id - a.id)` 仅在当前页内重排，跨页顺序错乱
- **建议**: 由后端排序（传排序参数），或删除此行前端排序

### 5. mock 数据冒充真实 AI 分析结果
- **文件**: `src/views/backend/Emotion.vue` 第 238-254 行
- **问题**: 无 AI 分析时展示硬编码假数据（含伪造时间戳 `17696596564`），误导管理员
- **建议**: 显示"暂无 AI 分析结果"提示，或从后端获取默认分析

### 6. 加载状态在异常时未复位
- **文件**: `src/views/backend/Consultation.vue` 第 109-118 行
- **问题**: `viewSessionDetail` 中无 `.catch()`，接口失败时 `loadingMessages` 永远为 `true`，页面一直 loading
- **建议**: 添加 `.catch()` 并在 finally 中将 `loadingMessages.value = false`

### 7. 表格列标签与内容不匹配
- **文件**: `src/views/backend/Consultation.vue` 第 7-14 行
- **问题**: 列名为"会话id"却显示用户昵称头像（`el-avatar` + `userNickname`）
- **建议**: 列 label 改为"用户"或"用户昵称"

### 8. SCSS 嵌套层级与 DOM 结构不符
- **文件**: `src/views/backend/Consultation.vue` 第 238-245 行
- **问题**: `.message-content` 在 SCSS 中嵌套于 `.message-header` 下，但模板中两者是兄弟节点，样式不会生效
- **建议**: 将 `.message-content` 提升为与 `.message-header` 同级

### 9. `handleEdit` 误用事件对象判断新增
- **文件**: `src/views/backend/Knowledge.vue` 第 5 行（模板）
- **问题**: `<el-button @click="handleEdit">` 未传参，`row` 是 MouseEvent，靠 `row.id` 恰好为 `undefined` 才进入新增分支
- **建议**: 改为 `@click="handleEdit()"` 并在函数内明确判断无参时为新增

### 10. 注册接口返回值处理与拦截器契约不一致
- **文件**: `src/views/auth/Register.vue` 第 89-95 行
- **问题**: 拦截器已 `return data.data`，但注册处再用 `res?.data` 取值，通常为 `undefined`；且与 Login.vue 处理方式不一致
- **建议**: 与 Login.vue 保持一致，直接从 `res` 中取字段，并在拦截器中统一处理 `BUSINESS_ERROR`

---

## 重要问题（应修复）

### 11. ECharts 实例未销毁 — 内存泄漏
- **文件**: `src/views/backend/DashBoard.vue` 第 118-120 行
- **问题**: 组件卸载时未 `dispose()` 图表实例；变量名拼写错误 `emtionChart`；使用 `let` 应为 `const`
- **建议**: 添加 `onBeforeUnmount` 清理所有图表实例，修正拼写，`let` 改 `const`

### 12. Dashboard 无错误处理且混合 await/then
- **文件**: `src/views/backend/DashBoard.vue` 第 185-197 行
- **问题**: `await` + `.then()` 混用；无 `.catch()`；若 `res.emotionTrend` 为 `undefined`，`trendData.value.map` 会抛错
- **建议**: 去掉 `await` 或去掉 `.then()`，添加 `.catch()`，对数据做空值保护

### 13. 计算属性中直接修改 props
- **文件**: `src/components/TableSearch.vue` 第 44-71 行
- **问题**: `formItemWithCol` computed 中使用 `Reflect.set(item, "col", {...})` 直接修改 props 数组元素
- **建议**: 使用 `map` 返回新数组 `formItem.map(item => ({...item, col: {...}}))`

### 14. SideBar 脆弱地依赖路由数组下标
- **文件**: `src/components/SideBar.vue` 第 31-49 行
- **问题**: `router.options.routes[0]` 硬编码取第一条路由为后台路由，路由顺序变化即崩溃；`default-active="1"` 与实际 index 不匹配导致菜单高亮失效
- **建议**: 使用命名路由或 meta 标识区分；`default-active` 绑定当前路由 path

### 15. NavBar 用户名硬编码
- **文件**: `src/components/NavBar.vue` 第 48-49 行
- **问题**: `username = "admin"`、`avatarUrl` 写死，未从 `localStorage.userInfo` 读取
- **建议**: 从 `JSON.parse(localStorage.getItem('userInfo'))` 读取真实用户信息

### 16. `el-rate` 用 `v-model` + `disabled` 矛盾
- **文件**: `src/views/backend/Emotion.vue` 第 17 行、第 63 行
- **问题**: disabled 的只读评分不应使用双向绑定
- **建议**: 改为 `:model-value="scope.row.moodScore"`

### 17. 搜索参数残留脏数据
- **文件**: `src/views/backend/Emotion.vue` 第 202-206 行
- **问题**: `params.moodScore = "1-3"` 字符串未在解析后 delete，仍会发给后端
- **建议**: 添加 `delete params.moodScore`

### 18. Login.vue 使用原生 alert 且逻辑反常
- **文件**: `src/views/auth/Login.vue` 第 75-77 行
- **问题**: `alert('没有账号，请先注册')` 与全局 `ElMessage` 风格不一致；无 token 不等于无账号
- **建议**: 改为 `ElMessage.warning('登录信息异常，请重新尝试')`

### 19. 注册表单校验缺失
- **文件**: `src/views/auth/Register.vue` 第 71-84 行
- **问题**: 邮箱无格式校验；`confirmPassword` 未校验与 password 一致；手机号无格式校验；`gender` 默认 `0` 但单选只有 `1/2`，初始无选中项
- **建议**: 补充邮箱正则校验、密码一致性校验、手机号正则校验

### 20. 未使用的导入与注释自相矛盾
- **文件**: `src/router/index.js` 第 1 行、`src/main.js` 第 6 行
- **问题**: `createWebHashHistory` 导入未使用；`main.js` 注释说"不需要引入"却仍 import element-plus 样式
- **建议**: 移除未使用的导入；如确实使用全量导入则删除矛盾注释

### 21. 前台三个核心页面为空壳
- **文件**: `src/views/frontend/Consulation.vue`、`src/views/frontend/Emotion.vue`、`src/views/frontend/Knowledge.vue`
- **问题**: 模板仅一行占位文字，样式已写好但功能未实现
- **建议**: 逐步实现前台咨询、情绪日记、知识库功能

### 22. `editorRef` 应使用 `shallowRef`
- **文件**: `src/components/ArticleDialog.vue` 第 184 行
- **问题**: 存储富文本编辑器实例应使用 `shallowRef`，复杂非响应式对象放入 `ref` 会触发深层响应化
- **建议**: `const editorRef = shallowRef(null)` 并从 vue 导入 `shallowRef`

---

## 次要问题（代码质量/安全）

### 23. 后端地址硬编码
- **文件**: `vite.config.js` 第 59 行、`src/constants/index.js` 第 4 行
- **问题**: 两处均硬编码 `http://159.75.169.224:1235`
- **建议**: 使用 `.env` 环境变量区分 dev/prod

### 24. 请求超时过短
- **文件**: `src/utils/request.js` 第 7 行
- **问题**: `timeout: 5000`，AI 咨询/情绪分析类接口容易超时
- **建议**: 提高到 10-15s，或按接口单独配置

### 25. 生产代码残留大量 `console.log`
- **文件**: `RichTextEditor.vue` 第 186-202 行、`NavBar.vue` 第 61 行、`SideBar.vue` 第 40 行、`DashBoard.vue` 第 192 行等
- **建议**: 移除或替换为条件编译 `__DEV__` 下的日志

### 26. RichTextEditor 死配置/未用 prop
- **文件**: `src/components/RichTextEditor.vue`
- **问题**: `showSecurityTip` prop 已声明但模板未使用；`lineHeight` 配置未加入 `toolbarKeys`
- **建议**: 移除未用 prop，或将 `lineHeight` 加入 `toolbarKeys`

### 27. 图表配置在模块加载时取空值
- **文件**: `src/constants/index.js` 第 57 行等
- **问题**: `trendData.value.map(...)` 在 import 时执行（此时为空数组），初始 option 数据为空
- **建议**: 将图表配置改为函数，在数据加载后调用生成

### 28. `uploadFile` 业务参数硬编码
- **文件**: `src/api/admin.js` 第 25-27 行
- **问题**: `businessType:'ARTICLE'`、`businessField:'cover'` 写死，`businessInfo` 参数仅用了 `businessId`
- **建议**: 扩展 `businessInfo` 参数或拆分为多个专用上传函数

### 29. `handleAction` 配置含未使用字段
- **文件**: `src/views/backend/Knowledge.vue` 第 226 行等
- **问题**: `config.title` 字段定义后未在 `handleAction` 中解构使用
- **建议**: 移除未使用的 `title` 字段，或在确认弹窗中使用

### 30. `index.html` 标题未改
- **文件**: `index.html` 第 8 行
- **问题**: 仍为默认 `Vite App`
- **建议**: 改为 `AI心理健康助手`

### 31. "返回首页"无点击事件
- **文件**: `src/views/auth/Login.vue` 第 5-7 行
- **问题**: 有 `cursor:pointer` 样式但无 `@click` 跳转事件
- **建议**: 添加 `@click="router.push('/front/index')"`

### 32. canvas 强制 `!important` 覆盖
- **文件**: `src/views/backend/DashBoard.vue` 第 258-261 行
- **问题**: `canvas { width: 100% !important; height: 100% !important; }` 干扰 ECharts 自身尺寸管理
- **建议**: 移除 `!important`，使用 ECharts 的 `resize()` 机制

---

## 修复优先级建议

| 优先级 | 编号 | 理由 |
|--------|------|------|
| P0 - 立即修复 | #1, #2, #6, #10 | 影响核心功能和全局接口处理 |
| P1 - 尽快修复 | #3, #4, #5, #7, #8, #9, #11, #12, #22 | 影响具体功能正确性或造成内存泄漏 |
| P2 - 计划修复 | #13-21 | 代码健壮性和完整性问题 |
| P3 - 优化改进 | #23-32 | 代码质量和可维护性提升 |
