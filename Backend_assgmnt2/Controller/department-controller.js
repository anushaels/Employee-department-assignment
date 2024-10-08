const express = require('express');
const HttpError = require('../Model/http-error');
const {validationResult} = require ('express-validator');
const Department = require('../Model/department');

const createDepartment = async (req,res,next)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('Invalid Inputs passed, please check your data',422)
    }
    const {name} = req.body;
    let existingdepartment;
    try{
        existingdepartment = await Department.findOne({name:name});    
    }
    catch(err){
        console.log(err)
        const error = new HttpError('Department Creation Failed, Please Try Again', 500);
        return next(error);
    }
    if(existingdepartment){
        const error = new HttpError('Department With Name Already Exists !! Change Name', 422);
        return next(error);
    }
    const createDepartment = new Department ({
        name:name,
        employee:[]
    })
    try{ 
        await createDepartment.save();
    }
    catch(err){
        const error = new HttpError('Department Creation Failed !!',500)
        return next(error);
    }
    res.status(201).json({department:createDepartment.toObject({getters:true})});
}


const updateDepartment = async (req,res,next)=>{
    const {name} = req.body;
    const departmentId = req.params.deptid;
    let department;
    try {
        department = await Department.updateOne({_id:departmentId},{$set:{name:name}})
        department = await Department.findById(departmentId)
    }
    catch(err){
        const error = new HttpError('Something Went Wrong,Could Not Update Department Name',500);
        return next(error);

    }
    if(!department){
        throw new HttpError('Could Not Find A Department With Given Id',404)
    }
    res.status(200).json({department:department});
}


const deleteDepartment = async (req,res,next)=>{
    const departmentId = req.params.deptid;
    let department;
    try {
        department = await Department.deleteOne({ _id:departmentId});
    }
    catch(err){
        const error = new HttpError('Something Went Wrong,Could Not Delete Department',500);
        return next(error);

    }
    if(!department){
        throw new HttpError('Could Not Find A Department With Given Id',404)
    }
    res.status(200).json({message:'Department Successfully Deleted :)'});
}


const getDepartmentById = async (req,res,next)=>{
    console.log('GET Request in departments');
    const departmentId = req.params.deptid;
    let department;
    try {
        department = await Department.findById(departmentId)
    }
    catch(err){
        const error = new HttpError('Something Went Wrong,Could Not Find Department',500);
        return next(error);

    }
    if(!department){
        throw new HttpError('Could Not Find A Department With Given Id',404)
    }
    res.json({department:department.toObject({getters:true})})
}


const getAllDepartment = async (req,res,next)=>{
    console.log('GET Request in departments');
    let department;
    try {
        department = await Department.find()
    }
    catch(err){
        const error = new HttpError('Something Went Wrong,Could Not Find A Department',500);
        return next(error);

    }
    if (!department || department.length === 0) {
        return res.status(404).json({ message: 'No Department To Show' });
    }
    res.json({department:department})
}

exports.createDepartment = createDepartment
exports.updateDepartment = updateDepartment
exports.deleteDepartment = deleteDepartment
exports.getDepartmentById = getDepartmentById
exports.getAllDepartment = getAllDepartment


