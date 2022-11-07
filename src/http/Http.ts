import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import NProgress from 'nprogress'
import { Message } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { getToken } from '@/utils/auth.ts'

interface ResType<T> {
  code: number
  data?: T
  msg: string
  err?: string
}

interface Http {
  get<T>(url: string, params?: unknown): Promise<ResType<T>>

  post<T>(url: string, params?: unknown): Promise<ResType<T>>

  upload<T>(url: string, params: unknown): Promise<ResType<T>>

  download(url: string): void
}

// 设置请求头和请求路径
axios.defaults.baseURL = 'https://api.movescan.org'
axios.defaults.timeout = 10000
axios.defaults.headers = {
  // @ts-ignoreÒ
  'Content-Type': 'application/json;charset=UTF-8',
  Accept: 'application/json, text/plain, */*',
  'X-Requested-With': 'XMLHttpRequest',
  'Access-Control-Allow-Origin': '*'
}

//请求拦截器
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config.headers = { 'Access-Control-Allow-Origin': '*' }
    const token = window.sessionStorage.getItem('token')
    if (token) {
      // @ts-ignore
      config.headers.token = token
    }
    return config
  },
  (error: Error) => {
    return error
  }
)
// 响应拦截
axios.interceptors.response.use(
  (config: any) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    if (getToken() && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
      let url = config.url + '?'
      for (const propName of Object.keys(config.params)) {
        const value = config.params[propName]
        var part = encodeURIComponent(propName) + '='
        if (value !== null && typeof value !== 'undefined') {
          if (typeof value === 'object') {
            for (const key of Object.keys(value)) {
              const params = propName + '[' + key + ']'
              var subPart = encodeURIComponent(params) + '='
              url += subPart + encodeURIComponent(value[key]) + '&'
            }
          } else {
            url += part + encodeURIComponent(value) + '&'
          }
        }
      }
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }
    return config
  },
  (error: AxiosError) => {
    // 接收到异常响应的处理开始
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      switch (error.response.status) {
        case 400:
          // ElMessage.error('错误请求')
          console.log('请求错误')
          break
        case 401:
          ElMessage.error('未授权，请重新登录')
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          // ElMessage.error('请求错误,未找到该资源')
          console.log('请求错误,未找到该资源')
          // window.location.href = '/NotFound'
          break
        case 405:
          ElMessage.error('请求方法未允许')
          break
        case 408:
          ElMessage.error('请求超时')
          break
        case 500:
          // ElMessage.error('服务器端出错')
          console.log('服务器端出错')
          break
        case 501:
          ElMessage.error('网络未实现')
          break
        case 502:
          ElMessage.error('网络错误')
          break
        case 503:
          ElMessage.error('服务不可用')
          break
        case 504:
          ElMessage.error('网络超时')
          break
        case 505:
          ElMessage.error('http版本不支持该请求')
          break
        default:
          ElMessage.error(`连接错误${error.response.status}`)
      }
    } else {
      // 超时处理
      // if (JSON.stringify(error).includes('timeout')) {
      //   ElMessage.error('服务器响应超时，请刷新当前页')
      // }
      // ElMessage.error('连接服务器失败')
      console.log('连接服务器失败')
    }
    // ElMessage.error(error.message)
    //处理结束
    //如果不需要错误处理，以上的处理过程都可省略
    return Promise.resolve(error.response)
  }
)

const Http: Http = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .get(url, { params })
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  post(url, params) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .post(url, JSON.stringify(params))
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  upload(url, file) {
    return new Promise((resolve, reject) => {
      NProgress.start()
      axios
        .post(url, file, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((res) => {
          NProgress.done()
          resolve(res.data)
        })
        .catch((err) => {
          NProgress.done()
          reject(err.data)
        })
    })
  },
  download(url) {
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    iframe.onload = function () {
      document.body.removeChild(iframe)
    }
    document.body.appendChild(iframe)
  }
}

export default Http
