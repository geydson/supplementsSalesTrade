import React, { useState, useEffect, useRef } from 'react'
import CIcon from '@coreui/icons-react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardImage,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CRow,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarNav,
  CSpinner,
  CToast,
  CToastBody,
  CToastHeader,
  CToaster,
} from '@coreui/react'
import { cilCheck, cilList } from '@coreui/icons'

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useIMask } from 'react-imask'
import DataTable from 'react-data-table-component'

import useApi from '../../../services/api'
import ReactImg from '../../../assets/images/react.jpg'

const NewOrder = () => {
  const { token, infosUser } = useSelector((state) => state.login)
  const [loading, setLoading] = useState(false)
  const [loadCreateOrder, setLoadCreateOrder] = useState(false)
  const [listProducts, setLisProducts] = useState([])
  const [sidebarShow, setSideBarShow] = useState(false)
  const [vendSelect, setVendSelect] = useState(infosUser?.role < 3 ? '' : infosUser?.codVend)
  const [clientSelect, setClientSelect] = useState('')
  const [listCart, setListCart] = useState([])
  const [listClients, setListClients] = useState([])
  const sellers = [
    { label: 'Selecione o Vendedor', value: 'notValid' },
    { label: 'Rafael Silva', value: '001' },
    { label: 'Valdemir Cestaro', value: '002' },
  ]
  const clients = [
    { label: 'Selecione o cliente', value: 'notValid' },
    {
      label: 'AMERICANAS S.A',
      state: 'RJ',
      razaoSocial: 'AMERICANAS S.A - EM RECUPERACAO JUDICIAL',
      value: '652b69eb1e55a163df039b1a',
      codVend: '001',
    },
    {
      label: 'INTEGRALMEDICA',
      state: 'SP',
      razaoSocial: 'BRG SUPLEMENTOS NUTRICIONAIS LTDA',
      value: '652b62ab6579235a83153372',
      codVend: '001',
    },
    {
      label: 'AMAZON.COM.BR',
      state: 'SP',
      razaoSocial: 'AMAZON SERVICOS DE VAREJO DO BRASIL LTDA.',
      value: '652b69259de657d9583fb1a6',
      codVend: '002',
    },
  ]
  const [listSellers, setListSellers] = useState([])

  const navigate = useNavigate()

  const api = useApi()

  useEffect(() => {
    const callListProducts = getListProducts()

    const newListSeller = sellers.filter(
      (i) => i.value == infosUser?.codVend || i.value == 'notValid',
    )

    const newListClient = clients.filter(
      (i) => i.codVend == infosUser?.codVend || i.value == 'notValid',
    )

    setListSellers(infosUser?.role < 3 ? sellers : newListSeller)
    setListClients(infosUser?.role < 3 ? clients : newListClient)

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
            price: item.price,
            stock: item.stock,
            quantSelected: 0,
          }),
        )
        setLisProducts(newData)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const sendOrder = async () => {
    if (clientSelect != 'notValid' && vendSelect != 'notValid') {
      setLoadCreateOrder(true)
      try {
        const dataCli = clients.filter((i) => i.value == clientSelect)[0]
        let countProducts = 0
        let totalProducts = 0
        let newCart = []

        listCart.map((i) => {
          countProducts += i.quantSelected
          totalProducts += i.price * i.quantSelected
          newCart.push({
            name: i.name,
            codProd: i.codProd,
            price: i.price,
            quant: i.quantSelected,
          })
        })

        const result = await api.insertNewOrder(token, {
          nameFantasia: dataCli.label,
          razaoSocial: dataCli.razaoSocial,
          codIdent: dataCli.value,
          state: dataCli.state,
          codVend: dataCli.codVend,
          total: totalProducts,
          quantItens: countProducts,
          items: newCart,
        })

        if (result && result.type == 'success') {
          navigate('/orders', { replace: true })
          alert(result.message)
        } else alert(result.message)
      } catch (error) {
      } finally {
        setLoadCreateOrder(false)
      }
    } else {
      alert('Verifique se o vendedor e cliente, foram selecionados corretamente!')
    }
  }

  const add = (item) => {
    const list = [...listCart]

    const index = list.findIndex((i) => i.codProd == item.codProd)

    if (index > -1) {
      list[index].quantSelected += 1
    } else {
      list.push({
        ...item,
        quantSelected: 1,
      })
    }

    setListCart(list)
  }

  const remove = (item) => {
    const list = [...listCart]

    const index = list.findIndex((i) => i.codProd == item.codProd)

    if (list[index].quantSelected == 1) {
      const nList = list.filter((item, i) => i != index)
      setListCart(nList)
    } else {
      list[index].quantSelected -= 1
      setListCart(list)
    }
  }

  const quantProdCart = (item) => {
    const produtoEspecifico = listCart.find((i) => i.codProd == item.codProd)
    if (!produtoEspecifico) {
      return 0
    }
    return produtoEspecifico.quantSelected
  }

  const totalProdCart = () => {
    let total = 0

    if (listCart && listCart.length > 0) {
      listCart.map((i) => {
        total += i.price * i.quantSelected
      })

      total = total.toFixed(2)
      total = total.toString().replace('.', ',')
    } else {
      total = '0,00'
    }

    return total
  }

  return (
    <>
      <CToaster placement="top-end">
        <CToast autohide={false} visible={loadCreateOrder}>
          <CToastHeader>
            <div className="fw-bold me-auto">Exclusão de usuário</div>
          </CToastHeader>
          <CToastBody>
            Realizando pedido, não saia da tela. Aguarde a conslusão....
            <CSpinner component="span" size="sm" aria-hidden="true" />
          </CToastBody>
        </CToast>
      </CToaster>

      {loading ? (
        <div style={{ textAlign: 'center' }}>
          <CSpinner component="span" color="primary" aria-hidden="true" />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'row', marginLeft: '-7px' }}>
            <div style={{ width: '18rem', marginRight: 10 }}>
              <CFormSelect
                aria-label="Selecione o cliente"
                options={listClients}
                value={clientSelect}
                onChange={(e) => setClientSelect(e.target.value)}
                valid={clientSelect.trim() != '' && clientSelect.trim() != 'notValid'}
                invalid={clientSelect == '' || clientSelect == 'notValid'}
              />
            </div>
            <div style={{ width: '18rem', marginRight: 10 }}>
              <CFormSelect
                aria-label="Vendedor"
                options={listSellers}
                value={vendSelect}
                onChange={(e) => setVendSelect(e.target.value)}
                valid={vendSelect.trim() != '' && vendSelect.trim() != 'notValid'}
                invalid={vendSelect == '' || vendSelect == 'notValid'}
              />
            </div>
            <CButton
              color="danger"
              disabled={listCart.length == 0}
              onClick={() => setSideBarShow(true)}
              style={{ color: '#fff' }}
            >
              Carrinho <CBadge color="warning">{listCart.length}</CBadge>
            </CButton>
          </div>
          <CRow>
            {listProducts.length > 0 &&
              listProducts.map((i, index) => (
                <CCard key={index} className="p-3 m-1" style={{ width: '18rem' }}>
                  <CCardImage orientation="top" src={ReactImg} />
                  <CCardBody>
                    <CCardTitle>{i.name}</CCardTitle>
                    <CCardText>{i.desc}</CCardText>
                    <CCardText>Valor R$ {i.price}</CCardText>

                    <CCardText>Qtd cart - {quantProdCart(i)}</CCardText>

                    <CButton
                      color="success"
                      style={{ color: 'white', marginRight: 10 }}
                      onClick={() => add(i)}
                      disabled={loadCreateOrder}
                    >
                      Comprar
                    </CButton>
                    <CButton
                      color="danger"
                      style={{ color: 'white' }}
                      onClick={() => remove(i)}
                      disabled={quantProdCart(i) == 0 || loadCreateOrder}
                    >
                      Remover
                    </CButton>
                  </CCardBody>
                </CCard>
              ))}
          </CRow>
        </>
      )}

      <CSidebar
        className="sidebar-end sidebar-light sidebar-overlaid"
        position="fixed"
        visible={sidebarShow}
        style={{ backgroundColor: '#f0f4f7', borderLeft: '1px solid' }}
      >
        <CSidebarBrand
          className="d-none d-md-flex p-0"
          style={{
            backgroundColor: '#f0f4f7',
            borderBottom: '1px solid',
          }}
        >
          <ul className="nav nav-underline" role="navigation">
            <li className="nav-item me-2 d-flex align-items-center">
              <button
                type="button"
                className="btn btn-close"
                aria-label="Close"
                onClick={() => setSideBarShow(false)}
              ></button>
            </li>
          </ul>
          {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} /> */}
          {/* <img src="/homelogo.png" className="sidebar-brand-full" height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} /> */}
        </CSidebarBrand>
        <CSidebarNav>
          {listCart.length > 0 &&
            listCart.map((i, index) => (
              <CCard key={index} className="m-1" style={{ backgroundColor: '#CCC' }}>
                <CCardBody>
                  <CCardTitle>{i.name}</CCardTitle>
                  <CCardText>Valor R$ {i.price}</CCardText>

                  <CCardText>Qtd cart - {quantProdCart(i)}</CCardText>

                  <div style={{ flexDirection: 'row' }}>
                    <CButton
                      color="success"
                      style={{ color: 'white', marginRight: 10 }}
                      onClick={() => add(i)}
                      disabled={loadCreateOrder}
                    >
                      Comprar
                    </CButton>
                    <CButton
                      color="danger"
                      style={{ color: 'white' }}
                      onClick={() => remove(i)}
                      disabled={quantProdCart(i) == 0 || loadCreateOrder}
                    >
                      Remover
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            ))}
        </CSidebarNav>
        <CSidebarFooter className=" align-items-center">
          <CCardText style={{ color: '#000' }}>TOTAL R$ {totalProdCart()} </CCardText>
          <CButton
            color="info"
            style={{ color: 'white', width: '100%' }}
            onClick={() => (window.confirm(`Deseja finalizar o pedido?`) ? sendOrder() : null)}
            disabled={loadCreateOrder}
          >
            Finalizar Compra
          </CButton>
        </CSidebarFooter>
      </CSidebar>
    </>
  )
}

export default NewOrder
