var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    deviceDetails: Array,
    name: String,
    email: String,
    phone: Number,
    active: Boolean
});

mongoose.model('User', userSchema);