'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.AcademicDepartmentRoutes = void 0;
const express_1 = __importDefault(require('express'));
const validateRequest_1 = __importDefault(
  require('../../middlewares/validateRequest'),
);
const academicDepartment_validation_1 = require('./academicDepartment.validation');
const academicDepartment_controller_1 = require('./academicDepartment.controller');
const router = express_1.default.Router();
router.post(
  '/create-department',
  (0, validateRequest_1.default)(
    academicDepartment_validation_1.academicDepartmentValidation
      .createAcademicDepartmentZodSchema,
  ),
  academicDepartment_controller_1.academicDepartmentController.createDepartment,
);
router.get(
  '/:id',
  academicDepartment_controller_1.academicDepartmentController
    .getSingleDepartment,
);
router.get(
  '/',
  academicDepartment_controller_1.academicDepartmentController.getAllDepartment,
);
router.patch(
  '/:id',
  (0, validateRequest_1.default)(
    academicDepartment_validation_1.academicDepartmentValidation
      .updateAcademicDepartmentZodSchema,
  ),
  academicDepartment_controller_1.academicDepartmentController.updateDepartment,
);
router.delete(
  '/:id',
  academicDepartment_controller_1.academicDepartmentController.deleteDepartment,
);
exports.AcademicDepartmentRoutes = {
  router,
};
