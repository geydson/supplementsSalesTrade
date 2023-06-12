import getSettings from '../shared/settings'
import ENV from '../shared/settings/constants'

// const BASE_URL = GET_URL();

const BASE_URL = () => {
  switch (process.env.REACT_APP_ENVIRONMENT.toUpperCase()) {
    case ENV.DEVELOPMENT:
      return getSettings('api', ENV.DEVELOPMENT).url

    case ENV.STAGING:
      return getSettings('api', ENV.STAGING).url

    case ENV.PRODUCTION:
      return getSettings('api', ENV.PRODUCTION).url

    default:
      return getSettings('api', ENV.DEVELOPMENT).url
  }
}

const request = async (method, endpoint, params, token = null) => {
  method = method.toLowerCase()
  let fullUrl = `${BASE_URL()}${endpoint}`
  let body = null

  switch (method) {
    case 'get':
      let queryString = new URLSearchParams(params).toString()
      fullUrl += `?${queryString}`
      break
    case 'post':
    case 'put':
    case 'delete':
      body = JSON.stringify(params)
      break
    default:
      break
  }

  let headers = { 'Content-Type': 'application/json' }

  if (token) headers.Authorization = `Bearer ${token}`

  let req = await fetch(fullUrl, { method, headers, body })
  let json = await req.json()
  return json
}

export default request
