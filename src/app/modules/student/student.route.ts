import express from 'express';
import { StudentController } from './student.controller';
// import validateRequest from '../../middlewares/validateRequest';
// import { StudentValidaion } from './student.validation';

const router = express.Router();

router.get('/:id', StudentController.getSingleStudent);
router.get('/', StudentController.getAllStudents);

// router.patch(
//   '/create-student',
//   validateRequest(StudentValidaion.updateStudentZodSchema),
//   StudentController.updateStudent,
// );

router.delete('/:id', StudentController.deleteStudent);

export const StudentRoutes = {
  router,
};
