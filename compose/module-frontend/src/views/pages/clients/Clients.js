import React, { useState, useEffect, useRef, useCallback } from 'react'
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
  CFormText,
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
import { useIMask } from 'react-imask'
import DataTable from 'react-data-table-component'

import listStates from './ListStates'
import useApi from '../../../services/api'

const Clients = () => {
  const { token, infosUser } = useSelector((state) => state.login)
  const [loading, setLoading] = useState(true)
  const [modalLoading, setModalLoading] = useState(false)
  const [listClients, setListClients] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [nameFant, setModalNameFant] = useState('')
  const [nameRazao, setModalNameRazao] = useState('')
  const [codVend, setModalCodVend] = useState('')
  const [modalId, setModalId] = useState('')
  const [codIdentification, setModalCodIdentification] = useState('')
  const [cep, setModalCep] = useState('')
  const [city, setModalCity] = useState('')
  const [state, setModalState] = useState('')
  const [bairro, setModalBairro] = useState('')
  const [logradouro, setModalLogradouro] = useState('')
  const [complement, setModalComplement] = useState('')
  const [number, setModalNumber] = useState('')
  const [listVend, setModalListVend] = useState([])
  const [messageLoad, setModalMessageLoad] = useState('')

  const [toast, addToast] = useState(0)
  const toaster = useRef(null)

  const maskCodIdent = useIMask(
    { mask: '00.000.000/0000-00' },
    {
      onAccept: (e) => setModalCodIdentification(e),
    },
  )
  const maskCep = useIMask(
    { mask: '00000-000' },
    {
      onAccept: (e) => setModalCep(e),
    },
  )

  const { id } = infosUser

  const api = useApi()

  useEffect(() => {
    const formListVend = () => {
      let newListVend = [{ label: 'selecione...', value: 0 }]

      if (infosUser?.sellers && infosUser.sellers.length > 0) {
        const { sellers } = infosUser

        sellers.map((i) =>
          newListVend.push({ label: `${i.codVend} - ${i.nome}`, value: i.codVend }),
        )
      }
      setModalListVend(newListVend)
    }

    formListVend()
    const callListClients = getListClients()

    return () => callListClients
  }, [])

  useEffect(() => {
    if (codIdentification && codIdentification.replace(/[^\d]/g, '').length == 14) {
      const callCheckCLient = handleLoadCheckClient(codIdentification.replace(/[^\d]/g, ''))
      return () => callCheckCLient
    }
    return
  }, [codIdentification])

  const columns = [
    {
      name: 'CNPJ',
      selector: (row) => row.codIdentification,
      sortable: true,
    },
    {
      name: 'Nome',
      selector: (row) => row.nameRazao,
      sortable: true,
    },
    {
      name: 'Razao Social',
      selector: (row) => row.nameFant,
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
            onClick={() => handleEditCLient(row)}
          >
            Editar
          </CButton>

          {infosUser?.role && infosUser?.role != 3 && (
            <CButton
              style={{ width: '80px', color: 'white' }}
              color="danger"
              onClick={(e) =>
                window.confirm(`Deseja confirmar a exclusão do usuário: ${row.nameRazao}?`)
                  ? handleExcludeClient(row)
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
      width: '170px',
    },
  ]

  const getListClients = async () => {
    setLoading(true)

    try {
      const { type, data } = await api.listClients(token)

      if (type === 'success') {
        let newData = []
        data.map((item) =>
          newData.push({
            id: item._id,
            state: item.state,
            city: item.city,
            nameFant: item.nameFantasia,
            nameRazao: item.razaoSocial,
            bairro: item.bairro,
            number: item.number,
            cep: item.cep,
            logradouro: item.logradouro,
            codIdentification: item.codIdent,
            codVend: item.codVend,
            complement: item.complement,
          }),
        )
        setListClients(newData)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setModalCodIdentification('')
    setShowModal(false)
  }

  const handleEditCLient = (item, notReShow = true) => {
    setModalNameFant(item.nameFant)
    setModalNameRazao(item.nameRazao)

    setModalCep(item.cep)
    setModalCity(item.city)
    setModalState(item.state)
    setModalBairro(item.bairro)
    setModalLogradouro(item.logradouro)
    setModalComplement(item.complement)
    setModalNumber(item.number)
    if (notReShow) {
      setModalId(item.id)
      setModalCodVend(item.codVend)
      setModalCodIdentification(item.codIdentification)
      setShowModal(true)
    }
  }

  const handleLoadCheckClient = async (cod) => {
    if (modalId != '') return

    setModalMessageLoad('Buscando informações...')
    setModalLoading(true)
    try {
      const result = await api.loadCheckClient(token, cod)
      if (result.type == 'success') {
        const { data } = result

        if (data?.state) setModalState(data.state.toUpperCase())

        setModalState('SP')

        handleEditCLient(
          {
            ...data,
          },
          false,
        )
      } else {
        setModalCodIdentification('')
        alert(result.message)
      }
    } catch (error) {
    } finally {
      setModalLoading(false)
    }
  }

  const handleExcludeClient = async (item) => {
    setModalMessageLoad('Realizando a exclusão, aguarde...')
    setModalLoading(true)
    try {
      const result = await api.excludeClient(token, item.id)
      if (result.type == 'success') {
        getListClients()
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
    if (
      state &&
      city &&
      nameFant &&
      nameRazao &&
      bairro &&
      number &&
      cep &&
      logradouro &&
      codIdentification &&
      codVend
    ) {
      setModalLoading(true)
      setModalMessageLoad(
        modalId == '' ? 'Cadastrando cliente, aguarde...' : 'Atualizando cliente, aguarde...',
      )
      let result
      if (modalId == '') {
        result = await api.registerClient(token, {
          state,
          city,
          nameFant,
          nameRazao,
          bairro,
          number,
          cep,
          logradouro,
          codIdentification,
          codVend,
          complement,
        })
      } else {
        result = await api.updateClient(token, modalId, {
          state,
          city,
          nameFant,
          nameRazao,
          bairro,
          number,
          cep,
          logradouro,
          codVend,
          complement,
        })
      }
      if (result && result.type === 'success') {
        setShowModal(false)
        getListClients()
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
          <h2>Lista de clientes</h2>

          <CCard>
            <CCardHeader style={{ alignItems: 'flex-end' }}>
              <CButton
                color="primary"
                onClick={() =>
                  handleEditCLient({
                    id: '',
                    nameFant: '',
                    codVend: '',
                    nameRazao: '',
                    codIdentification: '',
                    cep: '',
                    city: '',
                    state: '',
                    bairro: '',
                    logradouro: '',
                    complement: '',
                    number: '',
                  })
                }
              >
                <CIcon icon={cilCheck} /> Novo Cliente
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={columns}
                data={listClients}
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
        <CModalHeader>{modalId == '' ? 'Novo' : 'Editar'} Cliente</CModalHeader>
        <CModalBody>
          <CForm className="row g-3 needs-validation">
            {showModal && (
              <CCol md={6}>
                <CFormInput
                  ref={maskCodIdent.ref}
                  placeholder="Digite o CNPJ"
                  id="cnpj"
                  label="CNPJ"
                  required
                  value={codIdentification}
                  onChange={(e) => maskCodIdent.setValue(e.target.value)}
                  disabled={modalLoading || modalId != ''}
                />
              </CCol>
            )}
            <CCol md={6}>
              <CFormSelect
                id="validationDefault04"
                label="Tipo de acesso"
                options={listVend}
                value={codVend}
                onChange={(e) => setModalCodVend(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={12}>
              <CFormInput
                type="text"
                placeholder="Digite a razão social"
                id="razao-social"
                value={nameRazao}
                label="Razão Social"
                required
                onChange={(e) => setModalNameRazao(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={12}>
              <CFormInput
                type="text"
                placeholder="Digite o nome fantasia"
                id="name-fantasia"
                value={nameFant}
                label="Nome Fantasia"
                required
                onChange={(e) => setModalNameFant(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            {showModal && (
              <CCol md={4}>
                <CFormInput
                  ref={maskCep.ref}
                  placeholder="Digite o CEP"
                  id="cli-cep"
                  label="CEP"
                  required
                  value={cep}
                  onChange={(e) => maskCep.setValue(e.target.value)}
                  disabled={modalLoading}
                />
              </CCol>
            )}
            <CCol md={8}>
              <CFormInput
                type="text"
                placeholder="Digite o complemento"
                id="cod-complement"
                value={complement}
                label="Complemento"
                required
                onChange={(e) => setModalComplement(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>

            <CCol md={8}>
              <CFormInput
                type="text"
                placeholder="Digite a rua"
                id="cod-logradouro"
                value={logradouro}
                label="Rua"
                required
                onChange={(e) => setModalLogradouro(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={4}>
              <CFormInput
                type="text"
                placeholder="Digite o número"
                id="cod-number"
                value={number}
                label="Número"
                required
                onChange={(e) => setModalNumber(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>

            <CCol md={12}>
              <CFormInput
                type="text"
                placeholder="Digite o bairro"
                id="cod-bairro"
                value={bairro}
                label="Bairro"
                required
                onChange={(e) => setModalBairro(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={8}>
              <CFormInput
                type="text"
                placeholder="Digite a cidade"
                id="cod-cidade"
                value={city}
                label="Cidade"
                required
                onChange={(e) => setModalCity(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={4}>
              <CFormSelect
                id="validationDefault04"
                label="Estado"
                options={listStates}
                value={state}
                onChange={(e) => setModalState(e.target.value)}
                disabled={modalLoading}
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

export default Clients
