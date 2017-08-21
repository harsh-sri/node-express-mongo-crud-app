var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    active: Boolean
});

mongoose.model('User', userSchema);