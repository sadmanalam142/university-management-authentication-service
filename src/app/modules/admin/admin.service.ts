/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IPaginationOptions } from '../../../interfaces/pagination';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { IStudentFilters } from '../student/student.interface';
import { adminSearchableFields } from './admin.constant';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const result = await Admin.findById(id).populate('managementDepartment');
  return result;
};

const getAllAdmins = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IAdmin[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);
  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Admin.find(whereConditions)
    .populate('managementDepartment')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Admin.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateAdmin = async (
  id: string,
  payload: Partial<IAdmin>,
): Promise<IAdmin | null> => {
  const isExist = await Admin.find({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  const { name, ...adminData } = payload;
  const updatedAdminData: Partial<IAdmin> = { ...adminData };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>; // `name.fisrtName`
      (updatedAdminData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ id }, updatedAdminData, {
    new: true,
  });
  return result;
};

const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  const isExist = await Admin.find({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Admin.findOneAndDelete({ id }, { session });
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete admin');
    }
    await User.deleteOne({ id });
    await session.commitTransaction();
    await session.endSession();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const AdminService = {
  getSingleAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
};
