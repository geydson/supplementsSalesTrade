import { createActions } from 'reduxsauce'

const { Types, Creators } = createActions({
  setSideBarShow: ['sidebarShow'],
  setUnfoldable: ['unfoldable'],
})

export const LayoutTypes = Types
export default Creators
