import { takeLatest, all } from 'redux-saga/effects'

import { LoginTypes } from './login/Actions'
import { login } from './login/Saga'

export default function* root() {
  yield all([
    // STARTUP
    // takeLatest(StartupTypes.STARTUP, startup),
    // LOGIN
    // takeLatest(LoginTypes.LOGIN, login),
    // NOTIFICATION
    // takeLatest(NotificationTypes.ALERT_NOTIFICATION, NotificationAlert),
    // takeLatest(NotificationTypes.EVENT_NOTIFICATION, NotificationEvent),
    // takeLatest(NotificationTypes.LOG_NOTIFICATION, NotificationLog),
    // USER MANAGEMENT
    // takeLatest(UserManagementTypes.LIST_USER_MANAGEMENT, UserManagementList),
    // takeLatest(UserManagementTypes.SET_ORDER_MANAGEMENT, OrderManagementSet),
    // takeLatest(UserManagementTypes.SET_ADD_OR_REMOVE_MANAGEMENT, AddOrRemoveManagementSet),
    // takeLatest(UserManagementTypes.SET_SEARCH_USER_MANAGEMENT, SearchUserManagementSet)
  ])
}
