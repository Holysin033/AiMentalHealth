// 前端接口
import service from '@/utils/request'

// 注册接口 /user/add
export const register = async (data) => {
  return await service.post('/user/add', data)
}
// 创建新的会话 /psychological-chat/session/start
export const startSession = async (data) => {
  return await service.post('/psychological-chat/session/start', data)
}
// 分页查询咨询会话 /psychological-chat/sessions
export const getSessionList = async (params) => {
  return await service.get('/psychological-chat/sessions', { params })
}
// 获取会话消息列表 /psychological-chat/sessions/{sessionId}/messages
export const getSessionMessages = async (sessionId) => {
  return await service.get(`/psychological-chat/sessions/${sessionId}/messages`)
}
// 删除咨询会话 /psychological-chat/sessions/{sessionId}
export const deleteSession = async (sessionId) => {
  return await service.delete(`/psychological-chat/sessions/${sessionId}`)
}
// 注意：流式对话 /psychological-chat/stream 走 SSE，axios 无法处理，
// 请使用 @/api/chatStream 中的 streamChat

// 获取会话情绪分析结果 /psychological-chat/session/${sessionId}/emotion
export const getSessionEmotion = async (sessionId) => {
  return await service.get(`/psychological-chat/session/${sessionId}/emotion`)
}

// 创建或更新情绪日记 /emotion-diary
export const saveEmotionDiary = async (data) => {
  return await service.post('/emotion-diary', data)
}

// 查询知识文章列表 /knowledge/article/page
// params: {
//   sortField, 排序字段 默认 readCount
//   sortDirection, 排序方向 默认 desc
//   currentPage, 当前页
//   size, 每页条数
// }
export const getKnowledgeArticleList = async (params) => {
  return await service.get('/knowledge/article/page', { params })
}

// 获取知识文章详情 /knowledge/article/{id}
// params: {
//   id, 文章ID
// }
export const getKnowledgeArticleDetail = async (id) => {
  return await service.get(`/knowledge/article/${id}`)
}















