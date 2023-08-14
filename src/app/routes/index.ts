import express from 'express';
import { UserRoutes } from '../modules/user/user.router';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
