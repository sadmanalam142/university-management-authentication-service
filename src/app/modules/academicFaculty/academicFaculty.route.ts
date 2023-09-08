import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyController } from './academicFaculty.controller';
import { academicFacultyValidation } from './academicFaculty.validation';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequest(academicFacultyValidation.createAcademicFacultyZodSchema),
  academicFacultyController.createFaculty,
);

router.get('/:id', academicFacultyController.getSingleFaculty);
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.FACULTY,
    ENUM_USER_ROLE.STUDENT,
  ),
  academicFacultyController.getAllFaculty,
);

router.patch(
  '/:id',
  validateRequest(academicFacultyValidation.updateAcademicFacultyZodSchema),
  academicFacultyController.updateFaculty,
);

router.delete('/:id', academicFacultyController.deleteFaculty);

export const AcademicFacultyRoutes = {
  router,
};
