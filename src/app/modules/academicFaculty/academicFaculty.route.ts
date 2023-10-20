import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { academicFacultyController } from './academicFaculty.controller';
import { academicFacultyValidation } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-faculty',
  validateRequest(academicFacultyValidation.createAcademicFacultyZodSchema),
  academicFacultyController.createFaculty,
);

router.get('/:id', academicFacultyController.getSingleFaculty);
router.get('/', academicFacultyController.getAllFaculty);

router.patch(
  '/:id',
  validateRequest(academicFacultyValidation.updateAcademicFacultyZodSchema),
  academicFacultyController.updateFaculty,
);

router.delete('/:id', academicFacultyController.deleteFaculty);

export const AcademicFacultyRoutes = {
  router,
};
