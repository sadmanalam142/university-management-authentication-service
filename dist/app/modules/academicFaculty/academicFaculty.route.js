"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcademicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicFaculty_controller_1 = require("./academicFaculty.controller");
const academicFaculty_validation_1 = require("./academicFaculty.validation");
const router = express_1.default.Router();
router.post('/create-faculty', (0, validateRequest_1.default)(academicFaculty_validation_1.academicFacultyValidation.createAcademicFacultyZodSchema), academicFaculty_controller_1.academicFacultyController.createFaculty);
router.get('/:id', academicFaculty_controller_1.academicFacultyController.getSingleFaculty);
router.get('/', academicFaculty_controller_1.academicFacultyController.getAllFaculty);
router.patch('/:id', (0, validateRequest_1.default)(academicFaculty_validation_1.academicFacultyValidation.updateAcademicFacultyZodSchema), academicFaculty_controller_1.academicFacultyController.updateFaculty);
router.delete('/:id', academicFaculty_controller_1.academicFacultyController.deleteFaculty);
exports.AcademicFacultyRoutes = {
    router,
};
