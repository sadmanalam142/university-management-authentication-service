import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { IManagementDepartment } from './managementDepartment.interface';
import { managementDepartmentService } from './managementDepartment.service';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { managementDepartmentFilterableFields } from './managementDepartment.constant';

const createManagementDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const { ...managementDepartmentData } = req.body;
    const result = await managementDepartmentService.createManagementDepartment(
      managementDepartmentData,
    );
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Managrment Department created successfully !',
      data: result,
    });
  },
);
const getSingleManagementDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result =
      await managementDepartmentService.getSingleManagementDepartment(id);
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Managrment Department created successfully !',
      data: result,
    });
  },
);
const getAllManagementDepartments = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, managementDepartmentFilterableFields);
    const paginationOptions = pick(req.query, paginationFields);
    const result =
      await managementDepartmentService.getAllManagementDepartments(
        filters,
        paginationOptions,
      );
    sendResponse<IManagementDepartment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Managrment Department created successfully !',
      meta: result.meta,
      data: result.data,
    });
  },
);
const updateManagementDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedData = req.body;
    const result = await managementDepartmentService.updateManagementDepartment(
      id,
      updatedData,
    );
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Managrment Department created successfully !',
      data: result,
    });
  },
);
const deleteManagementDepartment = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await managementDepartmentService.deleteManagementDepartment(
      id,
    );
    sendResponse<IManagementDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Managrment Department created successfully !',
      data: result,
    });
  },
);

export const managementDepartmentController = {
  createManagementDepartment,
  getSingleManagementDepartment,
  getAllManagementDepartments,
  updateManagementDepartment,
  deleteManagementDepartment,
};
