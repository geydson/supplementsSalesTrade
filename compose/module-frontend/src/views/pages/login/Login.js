import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  CButton,
  // CLoadingButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CToast,
  CToastBody,
  CToastClose,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

import { useDispatch } from 'react-redux'
import useApi from '../../../services/api'
import LoginActions from '../../../shared/redux/login/Actions'

const Login = () => {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(['', ''])
  const [loading, setLoading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  // let location = useLocation()

  const api = useApi()

  const handleLoginButton = async () => {
    if (user && password) {
      setLoading(true)

      try {
        const result = await api.login(user, password)
        const { type, message, data } = result

        if (type === 'success') {
          const { token, auth, name, role, _id, sellers } = data
          if (auth === false) {
            // setError('Usuário bloqueado')
          } else {
            dispatch(LoginActions.loginSuccess(token, { name, role, id: _id, sellers }))
            navigate('/', { replace: true })
          }
        } else setError(['danger', message])
      } catch (error) {
        console.log(error)
        setError(['danger', 'Ocorreu um errro!'])
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
      setError(['danger', 'Preencha os dados corretamente!'])
    }
  }

  // let from = location.state?.from?.pathname || '/'

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={4}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Faça login em sua conta</p>

                    <CToast
                      autohide={true}
                      visible={error[0] !== '' ? true : false}
                      onClose={() => setError(['', ''])}
                      color={error[0]}
                      // style={{ marginBottom: 10, color: 'blue' }}
                      className="text-white align-items-center mb-3"
                    >
                      <div className="d-flex">
                        <CToastBody>{error[1]}</CToastBody>
                        <CToastClose className="me-2 m-auto" white />
                      </div>
                    </CToast>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        disabled={loading}
                        placeholder="Usuário"
                        autoComplete="username"
                        value={user}
                        onChange={(e) => setUser(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        disabled={loading}
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol className="d-grid gap-2 col-12 mx-auto">
                        <CButton
                          color="success"
                          className="text-white px-4"
                          // onClick={() => navigate(from, { replace: true })}
                          onClick={handleLoginButton}
                          disabled={loading}
                        >
                          {loading && (
                            <CSpinner
                              style={{ marginRight: 10 }}
                              component="span"
                              size="sm"
                              aria-hidden="true"
                            />
                          )}
                          {loading ? 'Carregando...' : 'Entrar'}
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6}>
                        <CButton color="primary" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              {/* <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard> */}
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
