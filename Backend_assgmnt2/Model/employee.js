const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const department = require('./department');


const employeeSchema = new Schema({
    fullname : {type: String,
        required: true,
        min: [3, 'Too Short For A Name'],
        max: [50,'Now Thats too Long'],
    },
    email: {type: String,
        unique: true,
        required: true ,
        match: [/^\S+@\S+\.\S+$/, 'Please Enter a Valid Email Address']},
    position: {type: String,
        required:true},
    department:{type: mongoose.Types.ObjectId,required:true,ref:'Department'},
    dateOfBirth: {type: Date,
        required:true},
    dateOfJoining: {type: Date,
        required:true},
    salary: {type: Number,
        required:true,
        min: [0, 'No Salary Thats Harsh']
    }
})

employeeSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Employee',employeeSchema);