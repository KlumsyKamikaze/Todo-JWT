const mongoose = require("mongoose")

const subtodoSchema = new mongoose.Schema({
    key: Number,
    value: String,
    completed: Boolean,
})

const userSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        min: 6,
        max: 255,
    },
    email: {
        type : String,
        required : true,
        min: 6,
        max: 255,
    },
    password: {
        type : String,
        required : true,
        min: 6,
        max: 1024,
    },
    date: {
        type:Date,
        default: Date.now()
    },
    arrTodo:[{
        key: Number,
        value: String,
        completed: Boolean,
        hasSubTodo: Boolean,
        subTodo: [subtodoSchema],
    }],
})

module.exports = mongoose.model('User',userSchema)