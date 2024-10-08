const express = require('express');
const HttpError = require('../Model/http-error');
const router = express.Router();
const employeeController = require('../Controller/employee-controller');
const {check} = require('express-validator');

router.post('/',[check('fullname').notEmpty().isLength({min:5}),
    check('email').notEmpty().isEmail(),
    check('salary').notEmpty().isNumeric()

],employeeController.createEmployee)


router.patch('/:empid',employeeController.updateEmployee);
router.delete('/:empid',employeeController.deleteEmployee);

router.get('/:empid',employeeController.getEmployeeById);
router.get('/',employeeController.getAllEmployee)

module.exports = router