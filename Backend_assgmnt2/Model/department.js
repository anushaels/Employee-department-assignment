const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')


const departmentSchema = new Schema({
    name : {type: String,
        min: [3, 'Too Short For A Name'],
        max: [50,'Now Thats too Long'],
        required: true,
        unique:true
    },
    employee : [{type: mongoose.Types.ObjectId,required:true,ref:'Employee'}]
})
departmentSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Department',departmentSchema);
