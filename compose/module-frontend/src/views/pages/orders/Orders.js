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

import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useIMask } from 'react-imask'
import DataTable from 'react-data-table-component'

import useApi from '../../../services/api'

const Orders = () => {
  const { token, infosUser } = useSelector((state) => state.login)
  const [loading, setLoading] = useState(false)
  const [listOrders, setLisOrders] = useState([])

  const navigate = useNavigate()

  const api = useApi()

  const columns = [
    {
      name: 'Nome Client',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Cod Vendedor',
      selector: (row) => row.codVend,
      sortable: true,
    },
    {
      name: 'Estado',
      selector: (row) => row.state,
      sortable: true,
    },
    {
      name: 'Valor Total',
      selector: (row) => `R$ ${row.total}`,
      sortable: true,
    },

    {
      name: 'Data do Pedido',
      selector: (row) => row.date,
      sortable: true,
    },
    {
      name: 'Ações',
      cell: (row) => (
        <CButtonGroup>
          <CButton
            style={{ width: '80px', color: 'white' }}
            color="info"
            disabled={loading}
            onClick={() => null}
          >
            Editar
          </CButton>

          <CButton
            style={{ width: '80px', color: 'white' }}
            color="danger"
            disabled={loading}
            onClick={(e) => null}
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
    const callListOrders = getListOrders()

    return () => callListOrders
  }, [])

  const getListOrders = async () => {
    setLoading(true)

    try {
      const { type, data } = await api.listOrders(token)

      if (type == 'success') {
        let newData = []

        data.map((item) => {
          newData.push({
            id: item._id,
            codVend: item.codVend,
            name: item.nameFantasia,
            total: item.total.toFixed(2).toString().replace('.', ','),
            state: item.state,
            date: moment(item.dateCreated).format('DD/MM/YYYY HH:mm:ss'),
          })
          return null
        })

        setLisOrders(newData)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Lista de pedidos</h2>

          <CCard>
            <CCardHeader style={{ alignItems: 'flex-end' }}>
              <CButton color="primary" onClick={() => navigate('/newOrder', { replace: true })}>
                <CIcon icon={cilCheck} /> Novo Pedido
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={columns}
                data={listOrders}
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
    </>
  )
}

export default Orders
