import request from './apiConfig'

export default function apiService() {
  return {
    // validateToken: async (token) => {
    //   let json = await request('post', '/auth/validate', {}, token)
    //   return json
    // },
    login: async (username, password) => {
      let json = await request('post', '/login', { username, password })
      return json
    },
    // logout: async (token) => {
    //   let json = await request('post', '/auth/logout', {}, token)
    //   return json
    // },
    // getUsers: async (token) => {
    //   let json = await request('post', '/auth/users', {}, token)
    //   return json
    // },
    // updateUser: async (token, id, data) => {
    //   let json = await request('put', `/auth/users/${id}`, data, token)
    //   return json
    // },
    // registerUser: async (token, data) => {
    //   let json = await request('post', `/auth/register`, data, token)
    //   return json
    // },
  }
}
