const config = require('../../config');

// Check a single string role against role present in decoded token.
// Decoded tokens was set to res local in previous authentication middleware.
exports.hasRole = (role) => {
  handleRole = (req, res, next) => {
    if ( role == res.locals.decoded.role){
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  }
  return handleRole;
}

// Check an array of string roles against role present in decoded token.
exports.hasAnyOfRoles = (roles) => {
  handleRoles = (req, res, next) => {
    if ( roles.indexOf(res.locals.decoded.role) > -1 ){
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  }
  return handleRoles;
}
