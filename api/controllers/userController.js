const jwt = require('jsonwebtoken');
const config = require('../../config');

const User = require('../models/User.js');
const Role = require('../models/Role.js');

// Auxiliary function for common validation
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
  // no auth on HTTP req ... no joy
  if(!req.body.username || !req.body.password) {
    return res.status(403).send({
        message: "Login failed."
    });
  }
  // authenticate user agains database
  User.findOne({ username: req.body.username })
  .then(user => {
    if(!user) {
      // user not found, auth fails
      return res.status(403).send({
          message: "Login failed."
      });
    }
    if(user.password != req.body.password){
      // user password not matching, auth fails.
      return res.status(403).send({
          message: "Login failed."
      });
    }
    // User OK, retrieve authorization level role
    Role.findById(user.role).then(role => {
      if(!role) {
        // role not found, auth fails
        return res.status(403).send({
            message: "Login failed."
        });
      }
      // Taylor JWT token along with user and role.
      const token = jwt.sign(
          {
            username: req.body.username,
            role: role.name
          },
          config.jwt.secret,
          { expiresIn: '1h' }
        );
      res.status(200).send({
          success: true,
          message: 'Authentication successful!',
          role: role.name,
          token: token
      });
    // Can't get Role ... auth fails.
    }).catch(err => {
      return res.status(403).send({
          message: "Login Failed."
      });
    });
  // Can't get User... auth fails.
  }).catch(err => {
    return res.status(403).send({
        message: "Login Failed."
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
  // Get updated Role
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
        // User not found... unable to comply
        if(!user) {
            return res.status(404).send({
                message: "User not found with id " + req.params.userId
            });
        }
        // Success! ... report back
        res.status(202).send(user);
    // Failures retrieving User
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
  // Failure retrieving Role.  
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
