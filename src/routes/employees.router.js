import {Router} from 'express'
import {pool} from '../db.js'

import {
    createEmployee,
    deleteEmployee,
    getEmployee,
    getEmployees,
    updateEmployee, 
    clasify_UtubeComments,
    
  } from "../controllers/employees.controller.js";

const router = Router()

router.get('/employees',getEmployees);
router.get('/employees/:id',getEmployee);

router.post('/employees',createEmployee);
router.patch('/employees/:id',updateEmployee);
router.delete('/employees/:id',deleteEmployee);




router.get('/comments',clasify_UtubeComments);


export default router