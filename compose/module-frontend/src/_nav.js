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
  cilPeople,
  cilBasket,
  cilAccountLogout,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
        to: '/base/accordion',
      },
    ],
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
