import axios from 'axios'

const baseURL =
  process.env.NODE_ENV === 'production' ? 'http://117.83.111.19:10048' : 'http://192.168.19.23:9094' //接口请求地址
console.log(process.env.NODE_ENV, baseURL)

const service = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  }
})
// 请求拦截器
service.interceptors.request.use(
  (config) => config,
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 对响应数据做处理（例如只返回data部分）
    const res = response.data
    // 这里根据你的后端接口协议进行修改
    if (!res.success) {
      return Promise.reject(res)
    }

    return res.data
  },
  (error) => {
    // 对响应错误做处理
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('登录过期')
          break
        case 403:
          console.log('拒绝访问')
          break
        case 500:
          console.log('服务器错误')
          break
        default:
          console.log(error.response.data.errMessage || '请求错误')
      }
    } else {
      console.log('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export default service
