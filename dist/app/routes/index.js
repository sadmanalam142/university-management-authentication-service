"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/user/user.route");
const academicSemester_route_1 = require("../modules/academicSemester/academicSemester.route");
const academicFaculty_route_1 = require("../modules/academicFaculty/academicFaculty.route");
const academicDepartment_route_1 = require("../modules/academicDepartment/academicDepartment.route");
const student_route_1 = require("../modules/student/student.route");
const faculty_route_1 = require("../modules/faculty/faculty.route");
const managementDepartment_route_1 = require("../modules/managementDepartment/managementDepartment.route");
const admin_route_1 = require("../modules/admin/admin.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/users/',
        route: user_route_1.UserRoutes.router,
    },
    {
        path: '/academic-semesters/',
        route: academicSemester_route_1.AcademicSemesterRoutes.router,
    },
    {
        path: '/academic-faculties/',
        route: academicFaculty_route_1.AcademicFacultyRoutes.router,
    },
    {
        path: '/academic-departments/',
        route: academicDepartment_route_1.AcademicDepartmentRoutes.router,
    },
    {
        path: '/management-departments/',
        route: managementDepartment_route_1.ManagementDepartmentRoutes.router,
    },
    {
        path: '/students/',
        route: student_route_1.StudentRoutes.router,
    },
    {
        path: '/faculties/',
        route: faculty_route_1.FacultyRoutes.router,
    },
    {
        path: '/admins/',
        route: admin_route_1.AdminRoutes.router,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
