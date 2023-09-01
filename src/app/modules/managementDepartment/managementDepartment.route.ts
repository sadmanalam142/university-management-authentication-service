import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { managementDepartmentValidation } from './managementDepartment.validation';
import { managementDepartmentController } from './managementDepartment.controller';

const router = express.Router();

router.post(
  '/create-management-department',
  validateRequest(
    managementDepartmentValidation.createManagementDepartmentZodSchema,
  ),
  managementDepartmentController.createManagementDepartment,
);

router.get(
  '/:id',
  managementDepartmentController.getSingleManagementDepartment,
);
router.get('/', managementDepartmentController.getAllManagementDepartments);

router.patch(
  '/:id',
  validateRequest(
    managementDepartmentValidation.updateManagementDepartmentZodSchema,
  ),
  managementDepartmentController.updateManagementDepartment,
);

router.delete(
  '/:id',
  managementDepartmentController.deleteManagementDepartment,
);

export const ManagementDepartmentRoutes = {
  router,
};
