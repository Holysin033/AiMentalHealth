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
  return await service.get('/psychological-chat/sessions', {params})
}





