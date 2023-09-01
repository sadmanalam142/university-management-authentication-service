"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagementDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const managementDepartment_validation_1 = require("./managementDepartment.validation");
const managementDepartment_controller_1 = require("./managementDepartment.controller");
const router = express_1.default.Router();
router.post('/create-management-department', (0, validateRequest_1.default)(managementDepartment_validation_1.managementDepartmentValidation.createManagementDepartmentZodSchema), managementDepartment_controller_1.managementDepartmentController.createManagementDepartment);
router.get('/:id', managementDepartment_controller_1.managementDepartmentController.getSingleManagementDepartment);
router.get('/', managementDepartment_controller_1.managementDepartmentController.getAllManagementDepartments);
router.patch('/:id', (0, validateRequest_1.default)(managementDepartment_validation_1.managementDepartmentValidation.updateManagementDepartmentZodSchema), managementDepartment_controller_1.managementDepartmentController.updateManagementDepartment);
router.delete('/:id', managementDepartment_controller_1.managementDepartmentController.deleteManagementDepartment);
exports.ManagementDepartmentRoutes = {
    router,
};
