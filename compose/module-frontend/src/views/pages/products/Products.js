import React, { useState, useEffect, useRef } from 'react'
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
  CFormSelect,
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

import useApi from '../../../services/api'

const Products = () => {
  const { token, infosUser } = useSelector((state) => state.login)
  const [loading, setLoading] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalId, setModalId] = useState('')
  const [codProd, setModalCodProd] = useState('')
  const [name, setModalName] = useState('')
  const [desc, setModalDesc] = useState('')
  const [price, setModalPrice] = useState(0)
  const [stock, setModalStock] = useState(0)
  const [listProducts, setLisProducts] = useState([])
  const [messageLoad, setModalMessageLoad] = useState('')

  const maskPrice = useIMask(
    {
      mask: [
        { mask: '{R$} 0{,00}' },
        { mask: '{R$} 00{,00}' },
        { mask: '{R$} 000{,00}' },
        { mask: '{R$} 0.000{,00}' },
        { mask: '{R$} 00.000{,00}' },
        { mask: '{R$} 000.000{,00}' },
        { mask: '{R$} 0.000.000{,00}' },
        { mask: '{R$} 00.000.000{,00}' },
        { mask: '{R$} 000.000.000{,00}' },
        { mask: '{R$} 0.000.000.000{,00}' },
      ],

      lazy: false,
      blocks: {
        num: {
          mask: Number,
          thousandsSeparator: ',',
        },
      },
      normalizeZeros: true,
      padFractionalZeros: true,
      scale: 2,
    },
    {
      onAccept: (e) => setModalPrice(e),
    },
  )

  const { id } = infosUser

  const api = useApi()

  const columns = [
    {
      name: 'Cod Prod',
      selector: (row) => row.codProd,
      sortable: true,
    },
    {
      name: 'Nome Produto',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Descrição',
      selector: (row) => row.desc,
      sortable: true,
    },

    {
      name: 'Preço',
      selector: (row) => `R$ ${row.price}`,
      sortable: true,
    },
    {
      name: 'Estoque',
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: 'Ações',
      cell: (row) => (
        <CButtonGroup>
          <CButton
            style={{ width: '80px', color: 'white' }}
            color="info"
            disabled={modalLoading}
            onClick={() => handleEditCLient(row)}
          >
            Editar
          </CButton>

          <CButton
            style={{ width: '80px', color: 'white' }}
            color="danger"
            disabled={modalLoading}
            onClick={(e) =>
              window.confirm(
                `Deseja confirmar a exclusão do produto: ${row.codProd} - ${row.name}?`,
              )
                ? handleExcludeClient(row)
                : null
            }
          >
            Excluir
          </CButton>
        </CButtonGroup>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '170px',
    },
  ]

  useEffect(() => {
    const callListProducts = getListProducts()

    return () => callListProducts
  }, [])

  const getListProducts = async () => {
    setLoading(true)

    try {
      const { type, data } = await api.listProducts(token)

      if (type === 'success') {
        let newData = []
        data.map((item) =>
          newData.push({
            id: item._id,
            codProd: item.codProd,
            name: item.name,
            desc: item.desc,
            price: item.price.toFixed(2).replace('.', ','),
            stock: item.stock,
          }),
        )
        setLisProducts(newData)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleEditCLient = (item, notReShow = true) => {
    setModalName(item.name)
    setModalCodProd(item.codProd)
    setModalDesc(item.desc)
    setModalStock(item.stock)
    if (notReShow) {
      setModalPrice(item.price)
      setModalId(item.id)
      setShowModal(true)
    }
  }

  const handleExcludeClient = async (item) => {
    setModalMessageLoad('Realizando a exclusão, aguarde...')
    setModalLoading(true)
    try {
      const result = await api.excludeProduct(token, item.id)
      if (result.type == 'success') {
        getListProducts()
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
    if (codProd && name && desc && price && stock) {
      setModalLoading(true)
      setModalMessageLoad(
        modalId == '' ? 'Cadastrando produto, aguarde...' : 'Atualizando produto, aguarde...',
      )
      const newPrice = price.toString().includes('R$') ? price.replace('R$ ', '') : price

      let result
      if (modalId == '') {
        result = await api.registerProducts(token, {
          codProd,
          name,
          desc,
          price: newPrice,
          stock,
        })
      } else {
        result = await api.updateProduct(token, modalId, {
          codProd,
          name,
          desc,
          price: newPrice,
          stock,
        })
      }
      if (result && result.type === 'success') {
        setShowModal(false)
        getListProducts()
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
          <h2>Lista de produtos</h2>

          <CCard>
            <CCardHeader style={{ alignItems: 'flex-end' }}>
              <CButton
                color="primary"
                onClick={() =>
                  handleEditCLient({
                    id: '',
                    codProd: '',
                    name: '',
                    desc: '',
                    price: 0,
                    stock: 0,
                  })
                }
              >
                <CIcon icon={cilCheck} /> Novo Produto
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={columns}
                data={listProducts}
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
        <CModalHeader>{modalId == '' ? 'Novo' : 'Editar'} Produto</CModalHeader>
        <CModalBody>
          <CForm className="row g-3 needs-validation">
            <CCol md={4}>
              <CFormInput
                type="text"
                placeholder="Informe o código"
                id="cod-prod"
                value={codProd}
                label="Código Produto"
                required
                maxLength={8}
                onChange={(e) => setModalCodProd(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={8}>
              <CFormInput
                type="text"
                placeholder="Digite o nome do produto"
                id="name-prod"
                value={name}
                label="Nome do Produto"
                required
                onChange={(e) => setModalName(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={12}>
              <CFormInput
                type="text"
                placeholder="Digite a descição do produto"
                id="desc-prod"
                value={desc}
                label="Descrição do Produto"
                required
                onChange={(e) => setModalDesc(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                ref={maskPrice.ref}
                placeholder="Digite o preço do produoto"
                id="price-prod"
                value={price}
                label="Preço do Produto"
                required
                onChange={(e) => maskPrice.setValue(e.target.value)}
                disabled={modalLoading}
              />
            </CCol>
            <CCol md={6}>
              <CFormInput
                type="number"
                placeholder="Digite o estoque do produto"
                id="stock-prod"
                value={stock}
                label="Estoque do Produto"
                required
                maxLength={8}
                onChange={(e) => setModalStock(e.target.value)}
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

export default Products
