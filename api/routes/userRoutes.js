const jwtChecker = require('../middleware/jwtChecker.js');

module.exports = (app) => {
    const users = require('../controllers/userController.js');

    // Login an User
    app.post('/users/login', users.login);

    // Create a new User
    app.post('/users', users.create);

    // Retrieve all Users
    app.get('/users', jwtChecker.checkToken, users.findAll);

    // Retrieve a single User with userId
    app.get('/users/:userId', users.findOne);

    // Update a User with userId
    app.put('/users/:userId', users.update);

    // Delete a User with userId
    app.delete('/users/:userId', users.delete);
}
