const express = require('express');
const HttpError = require('../Model/http-error');
const router = express.Router();
const departmentController = require('../Controller/department-controller');
const {check} = require('express-validator');

router.post('/',[check('name').notEmpty().isLength({min:5})],
departmentController.createDepartment)
router.patch('/:deptid',departmentController.updateDepartment);
router.delete('/:deptid',departmentController.deleteDepartment);

router.get('/:deptid',departmentController.getDepartmentById);
router.get('/',departmentController.getAllDepartment)

module.exports = router