// 前端接口
import service from '@/utils/request'

//注册接口 /user/add
export const register = async (data) => {
  return await service.post('/user/add', data)
}
