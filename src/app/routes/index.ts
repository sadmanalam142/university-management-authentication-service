import express from 'express';
import { UserRoutes } from '../modules/user/user.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { StudentRoutes } from '../modules/student/student.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { ManagementDepartmentRoutes } from '../modules/managementDepartment/managementDepartment.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users/',
    route: UserRoutes.router,
  },
  {
    path: '/academic-semesters/',
    route: AcademicSemesterRoutes.router,
  },
  {
    path: '/academic-faculties/',
    route: AcademicFacultyRoutes.router,
  },
  {
    path: '/academic-departments/',
    route: AcademicDepartmentRoutes.router,
  },
  {
    path: '/management-departments/',
    route: ManagementDepartmentRoutes.router,
  },
  {
    path: '/students/',
    route: StudentRoutes.router,
  },
  {
    path: '/faculties/',
    route: FacultyRoutes.router,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
