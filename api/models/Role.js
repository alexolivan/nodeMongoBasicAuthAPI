const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const RoleSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    desc: String
}, {
    timestamps: true
});
RoleSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Role', RoleSchema);
