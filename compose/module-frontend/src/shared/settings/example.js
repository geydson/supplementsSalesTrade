import getSettings, { getEnvironment } from './index'
import ENVIRONMENTS from './constants'

// get api url using environment set in .env
getSettings('api.url')
// => 'foo'

// get api object forcing PRODUCTION env
getSettings('api', ENVIRONMENTS.PRODUCTION)
// => { url: 'foo' , version: 'bar' }

// get key that does not exists
getSettings('foo.bar.baz')
// => null

// get whole config object using environment set in .env
getSettings()
// => { api: { url: 'foo' , version: 'bar' }, appver: 'baz'}

// get whole config object forcing DEVELOPMENT env
getSettings(null, ENVIRONMENTS.DEVELOPMENT)
// => { api: { url: 'foo' , version: 'bar' }, appver: 'baz'}

// get current environment set in .env (one of ENVIRONMENTS strings)
getEnvironment()
// => ENVIRONMENTS.DEVELOPMENT
