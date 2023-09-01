import { Request, Response } from 'express';
import { UserService } from './user.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IUser } from './user.interface';

const createStudent = catchAsync(async (req: Request, res: Response) => {
  const { student, ...user } = req.body;
  const result = await UserService.createStudent(student, user);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User and Student created successfully !',
    data: result,
  });
});

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const { faculty, ...user } = req.body;
  const result = await UserService.createFaculty(faculty, user);

  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User and Faculty created successfully !',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createFaculty,
};
