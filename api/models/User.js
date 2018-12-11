const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false},
    desc: String,
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
}, {
    timestamps: true
});
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
