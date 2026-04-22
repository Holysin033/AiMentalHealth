import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: '/api', // 请求基础URL
  timeout: 5000    // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 例如：添加请求头token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const {data,config,status} = response
    if (status === 200) {
      return data.data
    } else {
      if(data.code==='-1'){//token失效,登录超时，跳转到登录页面
         if (!config.url?.includes('/login')){
            ElMessage.error(data.msg||'登录过期，请重新登录')
            // 清除登录信息
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            // 跳转到登录页面
            window.location.href = '/auth/login'
         }
         else{
            ElMessage.error(data.msg||'登录过期，请重新登录')
            return Promise.reject('网络请求失败...')
         }
      }
    }
    return response
  },
  (error) => {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 导出axios实例
export default service