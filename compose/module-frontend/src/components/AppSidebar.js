import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import navigation from '../_nav'

import LayoutActions from '../shared/redux/layout/Actions'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const { sidebarShow, unfoldable } = useSelector((state) => state.layout)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(val) => dispatch(LayoutActions.setSideBarShow(val))}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        {/* <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} /> */}
        <img src="/homelogo.png" className="sidebar-brand-full" height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>

      <CSidebarNav>
        <SimpleBar>
          {/* <AppSidebarNav items={navigation} /> */}
          <AppSidebarNav items={navigation()} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(LayoutActions.setUnfoldable(!unfoldable))}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
