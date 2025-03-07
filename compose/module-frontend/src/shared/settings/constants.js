import DEFAULT_CONFIG from './files/config'
import DEVELOPMENT_CONFIG from './files/DEVELOPMENT.config'
import STAGING_CONFIG from './files/STAGING.config'
import PRODUCTION_CONFIG from './files/PRODUCTION.config'

const ENVIRONMENTS = {
  DEVELOPMENT: 'DEVELOPMENT',
  STAGING: 'STAGING',
  PRODUCTION: 'PRODUCTION',
}

export const configFiles = {
  [ENVIRONMENTS.DEVELOPMENT]: { ...DEFAULT_CONFIG, ...DEVELOPMENT_CONFIG },
  [ENVIRONMENTS.STAGING]: { ...DEFAULT_CONFIG, ...STAGING_CONFIG },
  [ENVIRONMENTS.PRODUCTION]: { ...DEFAULT_CONFIG, ...PRODUCTION_CONFIG },
}

export default ENVIRONMENTS
