import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IAcademicDepartment } from './academicDepartment.interface';
import { academicDepartmentService } from './academicDepartment.service';
import pick from '../../../shared/pick';
import { academicDepartmentFilterableFields } from './academicDepartment.constant';
import { paginationFields } from '../../../constants/pagination';

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const { ...academicDepartmentData } = req.body;
  const result = await academicDepartmentService.createDepartment(
    academicDepartmentData,
  );

  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department created successfully!',
    data: result,
  });
});

const getSingleDepartment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await academicDepartmentService.getSingleDepartment(id);

  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department retrived successfully!',
    data: result,
  });
});

const getAllDepartment = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, academicDepartmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await academicDepartmentService.getAllDepartment(
    filters,
    paginationOptions,
  );

  sendResponse<IAcademicDepartment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department retrived successfully!',
    meta: result.meta,
    data: result.data,
  });
});

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const updatedData = req.body;
  const result = await academicDepartmentService.updateDepartment(
    id,
    updatedData,
  );

  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department updated successfully!',
    data: result,
  });
});

const deleteDepartment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await academicDepartmentService.deleteDepartment(id);

  sendResponse<IAcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department deleted successfully!',
    data: result,
  });
});

export const academicDepartmentController = {
  createDepartment,
  getSingleDepartment,
  getAllDepartment,
  updateDepartment,
  deleteDepartment,
};
