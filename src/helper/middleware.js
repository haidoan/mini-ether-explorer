require('../config/environment');
const jwt = require('jsonwebtoken')
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

function decode (token, refresh = false) {
    if (refresh) {
      return jwt.verify(token, JWT_REFRESH_SECRET)
    } else {
      return jwt.verify(token, JWT_SECRET)
    }
  }
  
  function encode (message, refresh = false) {
    if (refresh) {
      return jwt.sign(message, JWT_REFRESH_SECRET, { algorithm: 'HS256' }, { expiresIn: '1y' })
    } else {
      return jwt.sign(message, JWT_SECRET, { algorithm: 'HS256' }, { expiresIn: '1h' })
    }
  }

exports.authen = async (req, res, next) => {
    try {
      const header = req.headers.authorization
      if (!header) return res.status(401).send({ message: 'UNAUTHORIZED' })
      const tokenArray = header.split(' ')
      if (tokenArray.length < 1) {
        return res.status(401).send({
            message: 'INVALID_PARAMS'
        })
      }
  
      const authRes = decode(tokenArray[1])
      req.user = authRes
      return next()
    } catch (error) {
      if (error.code === 'TOKEN_EXPIRED_MSG') {
        return res.status(401).send({
          error: 'TOKEN_EXPIRED'
        })
      }
      return res.status(401).send({
        error: 'INVALID_CREDENTIALS'
      })
    }
  }