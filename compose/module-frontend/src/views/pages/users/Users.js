import React, { useState, useEffect } from 'react'
// import {} from '@coreui/icons-react'
import CIcon from '@coreui/icons-react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner } from '@coreui/react'
import { cilCheck } from '@coreui/icons'
import DataTable from 'react-data-table-component'

// import useApi from '../'

const Users = () => {
  // const test = null

  const columns = [
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: 'Year',
      selector: (row) => row.year,
      sortable: true,
    },
    {
      cell: (row) => (
        <button onClick={(e) => console.log(row)}>{row.id == 1 ? 'Não' : 'simq'}</button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]

  const data = [
    {
      id: 1,
      title: 'Beetlejuice',
      year: '1988',
    },
    {
      id: 2,
      title: 'Ghostbusters',
      year: '1984',
    },
  ]

  return (
    <CRow>
      <CCol>
        <h2>Lista de usuários</h2>

        <CCard>
          <CCardHeader style={{ alignItems: 'flex-end' }}>
            <CButton color="primary">
              <CIcon icon={cilCheck} /> Novo Usuário
            </CButton>
          </CCardHeader>
          <CCardBody>
            <DataTable
              columns={columns}
              data={data}
              // progressPending={true}
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
  )
}

export default Users
