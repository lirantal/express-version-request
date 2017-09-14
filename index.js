'use strict'

class versionRequest {
  static setVersion (version) {
    return (req, res, next) => {
      req.version = this.formatVersion(version)
      next()
    }
  }

  static setVersionByHeader (headerName) {
    return (req, res, next) => {
      if (req && req.headers) {
        const version = (headerName && req.headers[headerName.toLowerCase()]) || req.headers['x-api-version']
        req.version = this.formatVersion(version)
      }

      next()
    }
  }

  static setVersionByQueryParam (queryParam, options = {removeQueryParam: false}) {
    return (req, res, next) => {
      if (req && req.query) {
        const version = (queryParam && req.query[queryParam.toLowerCase()]) || req.query['api-version']
        if (version !== undefined) {
          req.version = this.formatVersion(version)
          if (options && options.removeQueryParam === true) {
            if (queryParam && req.query[queryParam.toLowerCase()]) {
              delete req.query[queryParam.toLowerCase()]
            } else {
              delete req.query['api-version']
            }
          }
        }
      }
      next()
    }
  }

  static setVersionByAcceptHeader (customFunction) {
    return (req, res, next) => {
      if (req && req.headers && req.headers.accept) {
        if (customFunction && typeof customFunction === 'function') {
          req.version = this.formatVersion(customFunction(req.headers.accept))
        } else {
          const params = req.headers.accept.split(';')[1]
          const paramMap = {}
          if (params) {
            for (let i of params.split(',')) {
              const keyValue = i.split('=')
              paramMap[this.removeWhitespaces(keyValue[0]).toLowerCase()] = this.removeWhitespaces(keyValue[1])
            }
            req.version = this.formatVersion(paramMap.version)
          }

          if (req.version === undefined) {
            req.version = this.formatVersion(this.setVersionByAcceptFormat(req.headers))
          }
        }
      }

      next()
    }
  }

  static setVersionByAcceptFormat (headers) {
    const header = this.removeWhitespaces(headers.accept)
    let start = header.indexOf('-v')
    if (start === -1) {
      start = header.indexOf('.v')
    }
    const end = header.indexOf('+')
    if (start !== -1 && end !== -1) {
      return header.slice(start + 2, end)
    }
  }

  static isObject (variable) {
    return typeof variable === 'object' || typeof variable === 'function'
  }

  static removeWhitespaces (str) {
    return str.replace(/\s/g, '')
  }

  static formatVersion (version) {
    if (!version || typeof version === 'function' || version === true) {
      return undefined
    }
    if (typeof version === 'object') {
      return JSON.stringify(version)
    }
    let ver = version.toString()
    let split = ver.split('.')
    if (split.length === 3) {
      return ver
    }
    if (split.length < 3) {
      for (let i = split.length; i < 3; i++) {
        ver += '.0'
      }
      return ver
    }
    if (split.length > 3) {
      return split.slice(0, 3).join('.')
    }
  }
}

module.exports = versionRequest
