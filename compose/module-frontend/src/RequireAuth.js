import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import useApi from './services/api'
import LoginActions from './shared/redux/login/Actions'

export const RequireAuth = ({ children }) => {
  const api = useApi()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.login)
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState(token ? true : false)

  useEffect(() => {
    const checkLogin = async () => {
      if (token) {
        // const result = await api.validateToken(token)
        // const { user, error } = result
        // console.log('aaaa', result)
        // if (error === '') {
        //   const { blocked } = user
        //   if (!blocked) {
        //     const { acess } = result
        //     dispatch(LoginActions.setAcessUser(acess || []))
        setLoading(false)
        setAuth(true)
        //   } else {
        //     dispatch(LoginActions.loginSuccess('', []))
        //     setAuth(false)
        //   }
        // } else {
        //   alert(error)
        //   setAuth(false)
        // }
      } else {
        setAuth(false)
      }
    }
    checkLogin()
  }, [])

  if (!auth) return <Navigate to="/login" />

  return children
}
