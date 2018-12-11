const jwt = require('jsonwebtoken');
const config = require('../../config');

const User = require('../models/User.js');
const Role = require('../models/Role.js');


validateBody = (req, res) => {
  if(!req.body.username) {
      return res.status(400).send({
          message: "User username field cannot be empty."
      });
  }
  if( !req.body.password) {
      return res.status(400).send({
          message: "User password field cannot be empty."
      });
  }
  if(!req.body.role) {
      return res.status(400).send({
          message: "User role field cannot be empty."
      });
  }
};

// Login user
exports.login = (req, res) => {
  // Validate request
  if(!req.body.username || !req.body.password) {
    return res.status(403).send({
        message: "Login failed.1"
    });
  }

  User.findOne({ username: req.body.username })
  .then(user => {
      if(!user) {
        return res.status(403).send({
            message: "Login failed.2"
        });
      }
      if(user.password != req.body.password){
        return res.status(403).send({
            message: "Login failed.3"
        });
      }
      // Generate JWT token.
      const token = jwt.sign({username: req.body.username},
          config.jwt.secret,
          { expiresIn: '1h' }
        );
      res.status(200).send({
          success: true,
          message: 'Authentication successful!',
          role: user.role,
          token: token
      });
  }).catch(err => {
    return res.status(403).send({
        message: "Login Failed.4"
    });
  });
};

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  validateBody(req, res);

  Role.findOne({ name: req.body.role })
  .then(role => {
    // Create a User
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        role: role,
        desc: req.body.desc || ""
    });
    // Save User in the database
    user.save()
    .then(data => {
      res.status(201).send(data);
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while creating the User."
          });
      });
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Some error occurred while retrieving role."
        });
    });
};

// Retrieve and return all users from the database.
exports.findAll = (req, res) => {
  User.find()
  .then(users => {
      res.status(200).send(users);
  }).catch(err => {
      res.status(500).send({
          message: err.message || "Some error occurred while retrieving users."
      });
  });
};

// Find a single user with an userId
exports.findOne = (req, res) => {
  User.findById(req.params.userId)
  .then(user => {
      if(!user) {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });
      }
      res.status(200).send(user);
  }).catch(err => {
      if(err.kind === 'ObjectId') {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });
      }
      return res.status(500).send({
          message: "Error retrieving user with id " + req.params.userId
      });
  });
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // Validate request
  validateBody(req, res);

  Role.findOne({ name: req.body.role })
  .then(role => {
      // Find user and update it with the request body
      User.findByIdAndUpdate(req.params.userId, {
        username: req.body.username,
        password: req.body.password,
        role: role,
        desc: req.body.desc || ""
      }, {new: true})
      .then(user => {
          if(!user) {
              return res.status(404).send({
                  message: "User not found with id " + req.params.userId
              });
          }
          res.status(202).send(user);
      }).catch(err => {
          if(err.kind === 'ObjectId') {
              return res.status(404).send({
                  message: "User not found with id " + req.params.userId
              });
          }
          return res.status(500).send({
              message: "Error updating user with id " + req.params.userId
          });
      });
    }).catch(err => {
        return res.status(500).send({
            message: err.message || "Some error occurred while retrieving role."
        });
    });

};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.userId)
  .then(user => {
      if(!user) {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });
      }
      res.status(202).send({message: "User deleted successfully!"});
  }).catch(err => {
      if(err.kind === 'ObjectId' || err.name === 'NotFound') {
          return res.status(404).send({
              message: "User not found with id " + req.params.userId
          });
      }
      return res.status(500).send({
          message: "Could not delete  with id " + req.params.userId
      });
  });
};
