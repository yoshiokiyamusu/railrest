import {Router} from 'express'
import {pool} from '../db.js'

import {
    createEmployee,
    deleteEmployee,
    getEmployee,
    getEmployees,
    updateEmployee, 
    get_UtubeComments,  
  } from "../controllers/employees.controller.js";

const router = Router()

router.get('/employees',getEmployees);
router.get('/employees/:id',getEmployee);

router.post('/employees',createEmployee);
router.patch('/employees/:id',updateEmployee);
router.delete('/employees/:id',deleteEmployee);



router.get('/utube',get_UtubeComments);

export default router