import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

import useApi from '../services/api'
import LoginActions from '../shared/redux/login/Actions'

const DefaultLayout = () => {
  const api = useApi()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.login)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      if (token) {
        const result = await api.validateToken(token)
        const { user, error } = result
        if (error === '') {
          const { blocked } = user
          if (!blocked) {
            const { acess } = result
            dispatch(LoginActions.setAcessUser(acess || []))
            setLoading(false)
          } else {
            dispatch(LoginActions.loginSuccess('', []))
            // navigate('/login', { replace: true })
          }
        } else {
          alert(error)
          // navigate('/login', { replace: true })
        }
      } else {
        // navigate('/login', { replace: true })
      }
    }
    checkLogin()
  }, [])

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
