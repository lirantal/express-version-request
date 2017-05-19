'use strict'

class versionRequest {
  static setVersion (version) {
    return (req, res, next) => {
      req.version = version
      next()
    }
  }

  static setVersionByHeader (headerName) {
    return (req, res, next) => {
      if (req && req.headers) {
        const version = (headerName && req.headers[headerName.toLowerCase()]) || req.headers['x-api-version']
        if (version !== undefined) {
          if (this.isObject(version)) {
            req.version = JSON.stringify(version)
          } else {
            req.version = version
          }
        }
      }

      next()
    }
  }

  static setVersionByQueryParam (queryParam) {
    return (req, res, next) => {
      if (req && req.query) {
        const version = (queryParam && req.query[queryParam.toLowerCase()]) || req.query['api-version']
        if (version !== undefined) {
          if (this.isObject(version)) {
            req.version = JSON.stringify(version)
          } else {
            req.version = version
          }
        }
      }

      next()
    }
  }

  static isObject (variable) {
    return typeof variable === 'object' || typeof variable === 'function'
  }
}

module.exports = versionRequest
