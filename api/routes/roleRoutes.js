const authentication = require('../middleware/authentication.js');
const authorization = require('../middleware/authorization.js');

module.exports = (app) => {
    const roles = require('../controllers/roleController.js');

    // Create a new Role
    app.post('/roles', [authentication.checkToken, authorization.hasRole('admin')], roles.create);

    // Retrieve all Roles
    app.get('/roles', [authentication.checkToken, authorization.hasRole('admin')], roles.findAll);

    // Retrieve a single Role with roleId
    app.get('/roles/:roleId', [authentication.checkToken, authorization.hasRole('admin')], roles.findOne);

    // Update a Role with roleId
    app.put('/roles/:roleId', [authentication.checkToken, authorization.hasRole('admin')], roles.update);

    // Delete a Role with roleId
    app.delete('/roles/:roleId', [authentication.checkToken, authorization.hasRole('admin')], roles.delete);
}
