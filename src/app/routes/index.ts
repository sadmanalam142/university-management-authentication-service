import express from 'express';
import { UserRoutes } from '../modules/user/user.router';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
