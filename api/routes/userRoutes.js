const authentication = require('../middleware/authentication.js');
const authorization = require('../middleware/authorization.js');

module.exports = (app) => {
    const users = require('../controllers/userController.js');

    // Login an User
    app.post('/users/login', users.login);

    // Create a new User
    app.post('/users', [authentication.checkToken, authorization.hasRole('admin')], users.create);

    // Retrieve all Users
    app.get('/users', [authentication.checkToken, authorization.hasRole('admin')], users.findAll);

    // Retrieve a single User with userId
    app.get('/users/:userId', [authentication.checkToken, authorization.hasAnyOfRoles(['user', 'admin'])], users.findOne);

    // Update a User with userId
    app.put('/users/:userId', [authentication.checkToken, authorization.hasAnyOfRoles(['user', 'admin'])], users.update);

    // Delete a User with userId
    app.delete('/users/:userId', [authentication.checkToken, authorization.hasRole('admin')], users.delete);
}
