const jwt = require('jsonwebtoken');
const config = require('../../config');

exports.checkToken = (req, res, next) => {
  // Grab token from HTTP request
  let token = req.headers['x-access-token'] || req.headers['authorization'];

  if (token) {
    // got token! Clean if needed
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    // Verify and decode.
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) {
        return res.status(403).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        // Append decoded token in response locals
        // Next middleware authorization will need it.
        res.locals.decoded = decoded;
        next();
      }
    });
  } else {
    // no token, no joy.
    return res.status(401).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};
