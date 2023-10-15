import React, { useEffect } from 'react'
import { CSpinner } from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useApi from '../../../services/api'
import LoginActions from '../../../shared/redux/login/Actions'

const Logout = () => {
  const api = useApi()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.login)
  const dispatch = useDispatch()

  useEffect(() => {
    const doLogout = async () => {
      await api.logout(token)
      dispatch(LoginActions.logoutUser())
      navigate('/login', { replace: true })
    }
    doLogout()
  }, [])

  return <CSpinner color="primary" />
}

export default Logout
