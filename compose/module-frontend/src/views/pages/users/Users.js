import React, { useState, useEffect, useRef } from 'react'
// import {} from '@coreui/icons-react'
import CIcon from '@coreui/icons-react'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CSpinner,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { cilCheck } from '@coreui/icons'

import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'

import useApi from '../../../services/api'

const Users = () => {
  const { token, infosUser } = useSelector((state) => state.login)
  const [loading, setLoading] = useState(true)
  const [modalLoading, setModalLoading] = useState(false)
  const [listUsers, setListUsers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [nameUser, setModalNameUser] = useState('')
  const [userName, setModalUserName] = useState('')
  const [codVend, setModalCodVend] = useState('')
  const [modalId, setModalId] = useState('')
  const [passwordUser, setModalPassWord] = useState('')
  const [passwordUserConfirm, setModalPassWordConfirm] = useState('')
  const [valTypeAccess, setModalValTypeAccess] = useState('')
  const [messageLoad, setModalMessageLoad] = useState('')
  const [typeAccess, setModalTypeAccess] = useState([
    { label: 'selecione...', value: 0 },
    { label: 'administrador', value: 1 },
    { label: 'gerente', value: 2, selected: true },
    { label: 'vendedor', value: 3 },
  ])
  const [toast, addToast] = useState(0)
  const toaster = useRef(null)

  const { id } = infosUser

  const api = useApi()

  useEffect(() => {
    const callListUsers = getListUsers()
    return () => callListUsers
  }, [])

  const columns = [
    {
      name: 'Nome',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Usuário',
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: 'Acesso',
      selector: (row) => typeAccess.find((i) => i.value == row.role).label,
      sortable: true,
    },
    {
      name: 'Cod. Vendedor',
      selector: (row) => row.codVend,
      sortable: true,
    },
    {
      name: 'Ações',
      cell: (row) => (
        <CButtonGroup>
          <CButton
            style={{ width: '80px', color: 'white' }}
            color="info"
            onClick={() => handleEditUser(row)}
          >
            Editar
          </CButton>

          {id != row.id && (
            <CButton
              style={{ width: '80px', color: 'white' }}
              color="danger"
              onClick={(e) =>
                window.confirm(`Deseja confirmar a exclusão do usuário: ${row.username}?`)
                  ? handleExcludeUser(row)
                  : null
              }
            >
              Excluir
            </CButton>
          )}
        </CButtonGroup>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      // height: '100px',
      width: '170px',
      // maxWidth: '600px',
      // minWidth: '150px',
    },
  ]

  const getListUsers = async () => {
    setLoading(true)

    try {
      const { type, data } = await api.listUsers(token)

      if (type === 'success') {
        let newData = []
        data.map((item) =>
          newData.push({
            id: item._id,
            name: item.name,
            role: item.role,
            codVend: item.codVend,
            username: item.username,
          }),
        )
        setListUsers(newData)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleEditUser = (item) => {
    setModalId(item.id)
    setModalNameUser(item.name)
    setModalCodVend(parseInt(item.codVend))
    setModalUserName(item.username)
    setModalValTypeAccess(item.role)
    setModalPassWord('')
    setModalPassWordConfirm('')
    setShowModal(true)
  }

  const handleExcludeUser = async (item) => {
    setModalMessageLoad('Realizando a exclusão, aguarde...')
    setModalLoading(true)
    try {
      const result = await api.excludeUser(token, item.id)

      if (result.type === 'success') {
        getListUsers()
        alert(result.message)
      } else {
        alert(result.message)
      }
    } catch (error) {
    } finally {
      setModalLoading(false)
    }
  }

  const handleModalSave = async () => {
    if (nameUser && userName && valTypeAccess) {
      if (modalId == '') {
        if (passwordUser.length < 3 || passwordUserConfirm.length < 3) {
          alert('Senha e confirmação de senha devem possuir no minímo 3 caracteres!')
          return
        } else if (passwordUser != passwordUserConfirm) {
          alert('Senha digitada e diferente da senha de confirmação!')
          return
        }
      }

      setModalMessageLoad(
        modalId == '' ? 'Cadastrando cliente, aguarde...' : 'Atualizando cliente, aguarde...',
      )
      setModalLoading(true)
      let result

      if (modalId == '') {
        result = await api.registerUser(token, {
          name: nameUser,
          role: valTypeAccess,
          codVend: codVend ? codVend : null,
          username: userName.toLocaleLowerCase(),
          password: passwordUser,
        })
      } else {
        result = await api.updateUser(token, modalId, {
          name: nameUser,
          role: valTypeAccess,
          codVend: codVend ? codVend : null,
          username: userName.toLocaleLowerCase(),
          password: passwordUser,
        })
      }

      if (result.type === 'success') {
        setShowModal(false)
        getListUsers()
      } else {
        alert(result.message)
      }
      setModalLoading(false)
    } else {
      alert('Preencha os campos!')
    }
  }

  return (
    <>
      <CToaster placement="top-end">
        <CToast autohide={false} visible={modalLoading}>
          <CToastHeader>
            <div className="fw-bold me-auto">Exclusão de usuário</div>
          </CToastHeader>
          <CToastBody>
            {messageLoad + ' '}
            <CSpinner component="span" size="sm" aria-hidden="true" />
          </CToastBody>
        </CToast>
      </CToaster>

      <CRow>
        <CCol>
          <h2>Lista de usuários</h2>

          <CCard>
            <CCardHeader style={{ alignItems: 'flex-end' }}>
              <CButton
                color="primary"
                onClick={() =>
                  handleEditUser({ id: '', name: '', codVend: '', username: '', role: '' })
                }
              >
                <CIcon icon={cilCheck} /> Novo Usuário
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={columns}
                data={listUsers}
                defaultSortFieldId={1}
                progressPending={loading}
                progressComponent={
                  <div className="text-center">
                    <CSpinner className="ms-auto" />
                    <br />
                    <strong role="status">Carregando...</strong>
                  </div>
                }
                striped
                highlightOnHover
                pointerOnHover
                pagination
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={handleCloseModal}>
        <CModalHeader>{modalId == '' ? 'Novo' : 'Editar'} Usuário</CModalHeader>
        <CModalBody>
          <CForm className="row g-3 needs-validation">
            <CCol md={6}>
              <CFormInput
                type="text"
                placeholder="Digite o nome do usuário"
                id="name-user"
                value={nameUser}
                label="Nome"
                required
                onChange={(e) => setModalNameUser(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="validationDefaultUsername">Username</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="inputGroupPrepend02">@</CInputGroupText>
                <CFormInput
                  type="text"
                  id="user-name"
                  value={userName}
                  placeholder="Digite o username "
                  aria-describedby="inputGroupPrepend02"
                  required
                  onChange={(e) => setModalUserName(e.target.value)}
                  disabled={modalLoading}
                />
              </CInputGroup>
            </CCol>
            <CCol md={6}>
              <CFormSelect
                id="validationDefault04"
                label="Tipo de acesso"
                options={typeAccess}
                value={valTypeAccess}
                onChange={(e) => setModalValTypeAccess(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="number"
                placeholder="Código de venda"
                id="cod-vend"
                value={codVend.toString()}
                maxLength={3}
                label="Código de vendedor"
                required
                onChange={(e) => setModalCodVend(e.target.value.toString())}
                disabled={(valTypeAccess != 3 ? true : false) || modalLoading}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="password"
                placeholder="Senha"
                id="password-user"
                value={passwordUser}
                label="Senha de acesso"
                minLength={3}
                required
                invalid={passwordUser.length < 3}
                valid={passwordUser.length > 3}
                onChange={(e) => setModalPassWord(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>

            <CCol md={6}>
              <CFormInput
                type="password"
                placeholder="Confirmar Senha"
                id="password-user-confirm"
                value={passwordUserConfirm ? passwordUserConfirm : ''}
                label="Confirmar nova senha"
                required
                disabled={(passwordUser && passwordUser.length >= 3 ? false : true) || modalLoading}
                invalid={passwordUser != passwordUserConfirm || passwordUserConfirm == ''}
                valid={passwordUser == passwordUserConfirm && passwordUserConfirm != ''}
                onChange={(e) => setModalPassWordConfirm(e.target.value)}
              />
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton disabled={modalLoading} color="primary" onClick={handleModalSave}>
            {modalLoading && (
              <CSpinner style={{ marginRight: 10 }} component="span" size="sm" aria-hidden="true" />
            )}
            {modalLoading ? 'Carregando...' : 'Salvar'}
          </CButton>
          <CButton disabled={modalLoading} color="secondary" onClick={handleCloseModal}>
            Cancelar
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Users
