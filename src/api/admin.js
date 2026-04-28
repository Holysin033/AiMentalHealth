// 管理端接口
import service from '@/utils/request'
// 登录接口 /user/login
export const login = async (data) => {
  return await service.post('/user/login', data)
}
// 获取知识文章分类 /knowledge/category/tree
export const getKnowledgeCate = async () => {
  return await service.get('/knowledge/category/tree')
}
// 获取知识文章列表 /knowledge/article/page
export const getKnowledgeArticleList = async (params) => {
  return await service.get('/knowledge/article/page', { params })
}
// 文件上传 /file/upload
export const uploadFile = async (file, businessInfo) => {
  const formData = new FormData()
  const { businessId } = businessInfo
  formData.append('file', file)
  formData.append('businessType', 'ARTICLE')
  formData.append('businessId', businessId)
  formData.append('businessField', 'cover')
  return await service.post('/file/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
}
//文章新增 /knowledge/article
export const createArticle = async (data) => {
  return await service.post('/knowledge/article', data)
}
//获取知识文章详情 /knowledge/article/{id}
export const getArticleDetail = async (id) => {
  return await service.get(`/knowledge/article/${id}`)
}
// 更新知识文章 /knowledge/article/{id}
export const updateArticle = async (id, data) => {
  return await service.put(`/knowledge/article/${id}`, data)
}



