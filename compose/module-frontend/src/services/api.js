import request from './apiConfig'

export default function apiService() {
  return {
    validateToken: async (token) => {
      let json = await request('post', '/validateToken', {}, token)
      return json
    },
    login: async (username, password) => {
      let json = await request('post', '/login', { username, password })
      return json
    },
    logout: async (token) => {
      let json = await request('post', '/logout', {}, token)
      return json
    },
    registerUser: async (token, data) => {
      let json = await request('post', `/users`, data, token)
      return json
    },
    listUsers: async (token) => {
      let json = await request('get', '/users', {}, token)
      return json
    },
    updateUser: async (token, id, data) => {
      let json = await request('put', `/users/${id}`, data, token)
      return json
    },
    excludeUser: async (token, id) => {
      let json = await request('delete', `/users/${id}`, {}, token)
      return json
    },
    loadCheckClient: async (token, cod) => {
      let json = await request('get', `/loadCheckClient/${cod}`, {}, token)
      return json
    },
    registerClient: async (token, data) => {
      let json = await request('post', `/clients`, data, token)
      return json
    },
    listClients: async (token) => {
      let json = await request('get', `/clients`, {}, token)
      return json
    },
    excludeClient: async (token, id) => {
      let json = await request('delete', `/clients/${id}`, {}, token)
      return json
    },
    updateClient: async (token, id, data) => {
      let json = await request('put', `/clients/${id}`, data, token)
      return json
    },
    registerProducts: async (token, data) => {
      let json = await request('post', `/products`, data, token)
      return json
    },
    listProducts: async (token) => {
      let json = await request('get', `/products`, {}, token)
      return json
    },
    updateProduct: async (token, id, data) => {
      let json = await request('put', `/products/${id}`, data, token)
      return json
    },
    excludeProduct: async (token, id) => {
      let json = await request('delete', `/products/${id}`, {}, token)
      return json
    },
    insertNewOrder: async (token, data) => {
      let json = await request('post', `/orders`, data, token)
      return json
    },
    listOrders: async (token) => {
      let json = await request('get', `/orders`, {}, token)
      return json
    },
    dataDadosDash: async (token) => {
      let json = await request('get', `/allInfosDashBoard`, {}, token)
      return json
    },
  }
}
