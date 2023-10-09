import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  // cilBell,
  // cilCalculator,
  // cilChartPie,
  // cilCursor,
  // cilDescription,
  // cilDrop,
  // cilNotes,
  // cilPencil,
  cilPuzzle,
  cilSpeedometer,
  // cilStar,
  cilCart,
  cilUser,
  cilPeople,
  cilBasket,
  cilAccountLogout,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle, CSidebarNav } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Novo Pedido',
    to: '/dashboard',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    badge: {
      color: 'success',
      text: 'NOVO',
    },
  },
  {
    component: CNavGroup,
    name: 'Clientes',
    // to: '/base',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/base/accordion',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Pedidos',
    // to: '/base',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/base/accordion',
      },
    ],
  },
  {
    component: CNavGroup,
    name: 'Produtos',
    // to: '/base',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Accordion',
        to: '/base/spinners',
      },
    ],
  },
  // {
  //   component: CNavGroup,
  //   name: 'Icons',
  //   // icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Free',
  //       to: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'NEW',
  //       },
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Flags',
  //       to: '/icons/flags',
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'CoreUI Brands',
  //       to: '/icons/brands',
  //     },
  //   ],
  // },
  {
    component: CNavTitle,
    name: 'Dados',
  },
  {
    component: CNavItem,
    name: 'Usuários',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Configurações',
  },
  {
    component: CNavItem,
    name: 'Sair',
    to: '/logout',
    icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
  },
]

export default _nav
