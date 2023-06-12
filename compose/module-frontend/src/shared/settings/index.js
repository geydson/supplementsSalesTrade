// eslint-disable-next-line import/no-extraneous-dependencies
// import { ENVIRONMENT } from 'react-dotenv';
import { get } from 'lodash'
import ENVS, { configFiles } from './constants'

const fallbackEnvironment = ENVS.DEVELOPMENT

const normalizeEnvironment = (env) => {
  if (env === undefined || env === null || typeof env !== 'string') return fallbackEnvironment
  if (env.toUpperCase().indexOf(ENVS.DEVELOPMENT.substr(0, 3)) !== -1) return ENVS.DEVELOPMENT
  if (env.toUpperCase().indexOf(ENVS.STAGING.substr(0, 3)) !== -1) return ENVS.STAGING
  if (env.toUpperCase().indexOf(ENVS.PRODUCTION.substr(0, 3)) !== -1) return ENVS.PRODUCTION
  return fallbackEnvironment
}

/**
 * Gets the current environment defined in dotenv.
 *
 * @return {string} Returns normalized string of environment.
 */
// export const getEnvironment = () => normalizeEnvironment(ENVIRONMENT || fallbackEnvironment);
export const getEnvironment = () => normalizeEnvironment(fallbackEnvironment)

/**
 * Gets the property value at path of config file.
 *
 * @param {string} key The key to query. Can be deep nested. Example: 'appver' or 'api.url'
 * @param {string} forceEnv Overides the environment defined in dotenv.
 * @return Returns the resolved value. If the resolved value is undefined, null is returned.
 */
const getSettings = (key = null, forceEnv = null) => {
  const env = forceEnv === null ? getEnvironment() : normalizeEnvironment(forceEnv)
  if (key === null || typeof key !== 'string') return configFiles[env]
  return get(configFiles[env], key, null)
}

export default getSettings
