import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { managementDepartmentValidation } from './managementDepartment.validation';
import { managementDepartmentController } from './managementDepartment.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-management-department',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
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
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(
    managementDepartmentValidation.updateManagementDepartmentZodSchema,
  ),
  managementDepartmentController.updateManagementDepartment,
);

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  managementDepartmentController.deleteManagementDepartment,
);

export const ManagementDepartmentRoutes = {
  router,
};
