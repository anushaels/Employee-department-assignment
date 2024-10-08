const express = require('express');
const HttpError = require('../Model/http-error');
const {validationResult} = require ('express-validator');
const Employee = require('../Model/employee');
const Department = require('../Model/department');
const mongoose= require('mongoose');


const createEmployee = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid Inputs passed, please check your data',422)
    }
    const {fullname, email, position, department, dateOfBirth, dateOfJoining, salary} = req.body;
    let existingEmployee;
    try{
        existingEmployee = await Employee.findOne({email:email});    
    }
    catch(err){
        const error = new HttpError('Creation Failed, Please Try Again', 500);
        return next(error);
    }
    if(existingEmployee){
        const error = new HttpError('Employee With Email Already Exists !!', 422);
        return next(error);
    }
    const createEmployee = new Employee ({
        fullname:fullname,
        email:email,
        position:position,
        department:department,
        dateOfBirth:dateOfBirth,
        dateOfJoining:dateOfJoining,
        salary:salary
    })
    let existingdepartment;
    try{
        existingdepartment = await Department.findById(department);
    }catch(err){
        const error = new HttpError('Employee Creation Failed',500);
        return next(error);
    }
    if(!existingdepartment){
        const error = new HttpError('Could Not Find Department,Try Again',500);
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createEmployee.save({session:sess})
        existingdepartment.employee.push(createEmployee);
        await existingdepartment.save({session:sess})
        await sess.commitTransaction();
    }catch(err){
        console.log(err)
        const error = new HttpError('Adding Employee Failed',500);
        return next(error);
    }
    res.status(201).json({employee:createEmployee});
}


const updateEmployee = async (req,res,next)=>{
    const {fullname, email, position, dateOfBirth, dateOfJoining, salary} = req.body;
    const employeeId = req.params.empid;
    let employee;
    try {
        employee = await Employee.updateMany({_id:employeeId},{$set:{fullname:fullname,
             email:email, position:position, dateOfBirth:dateOfBirth, 
             dateOfJoining:dateOfJoining, salary:salary}})
        employee = await Employee.findById(employeeId)
            
    }
    catch(err){
        const error = new HttpError('Something Went Wrong,Could Not Update Employee',500);
        return next(error);

    }
    if(!employee){
        throw new HttpError('Could Not Find A Employee With Given Id',404)
    }
    res.status(200).json({employee:employee});
}


const getEmployeeById = async (req,res,next)=>{
    console.log('GET Request in employees');
    const employeeId = req.params.empid;
    let employee;
    try {
        employee = await Employee.findById(employeeId)
    }
    catch(err){
        const error = new HttpError('Something Went Wrong,Could Not Find Employee',500);
        return next(error);

    }
    if(!employee){
        throw new HttpError('Could Not Find A Employee With Given Id',404)
    }
    res.json({employee:employee.toObject({getters:true})})
}


const getAllEmployee = async (req,res,next)=>{
    console.log('GET Request in employees');
    let employee;
    try {
        employee = await Employee.find()
    }
    catch(err){
        const error = new HttpError('Something Went Wrong,Could Not Find A Employee',500);
        return next(error);

    }
    if (!employee || employee.length === 0) {
        return res.status(404).json({ message: 'No Employee To Show' });
    }
    res.json({employee:employee})
}


const deleteEmployee = async (req,res,next)=>{
    const employeeId = req.params.empid;
    let employees;
    try {
        employees = await Employee.findById(employeeId).populate('department');
    }
    catch(err){
        const error = new HttpError('Deleting Employee Failed!',500);
        return next(error);

    }
    if(!employees){
        const error = new HttpError('Could Not Find A Employee With Given Id',404)
        return next(error);
    }
    try{
        const sess = await mongoose.startSession();
        sess.startTransaction()
        await employees.deleteOne({session:sess});
        employees.department.employee.pull(employees)
        await employees.department.save({session:sess})
        await sess.commitTransaction()
    }catch(err){
        console.log(err)
        const error = new HttpError('Something Went Wrong,Could Not Delete Employee',500)
        return next(error);
    }
    res.status(200).json({message:'Employee Successfully Deleted :)'});
}

exports.createEmployee = createEmployee
exports.updateEmployee = updateEmployee
exports.deleteEmployee = deleteEmployee
exports.getEmployeeById = getEmployeeById
exports.getAllEmployee = getAllEmployee


