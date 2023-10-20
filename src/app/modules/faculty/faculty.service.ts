/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { IPaginationOptions } from '../../../interfaces/pagination';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import {
  EVENT_FACULTY_DELETED,
  EVENT_FACULTY_UPDATED,
  facultySearchableFields,
} from './faculty.constant';
import { IFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import { IStudentFilters } from '../student/student.interface';
import { RedisClient } from '../../../shared/redis';

const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
  const result = await Faculty.findById(id)
    .populate('academicDepartment')
    .populate('academicFaculty');
  return result;
};

const getAllFaculties = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IFaculty[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: facultySearchableFields.map(field => ({
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
  const result = await Faculty.find(whereConditions)
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Faculty.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>,
): Promise<IFaculty | null> => {
  const isExist = await Faculty.find({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
  }
  const { name, ...facultyData } = payload;
  const updatedFacultyData: Partial<IFaculty> = { ...facultyData };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IFaculty>; // `name.fisrtName`
      (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Faculty.findOneAndUpdate({ id }, updatedFacultyData, {
    new: true,
  })
    .populate('academicDepartment')
    .populate('academicFaculty');

  try {
    if (result) {
      await RedisClient.publish(EVENT_FACULTY_UPDATED, JSON.stringify(result));
    }
  } catch (error) {
    console.error('Error publishing to Redis:', error);
  }

  return result;
};

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
  const isExist = await Faculty.find({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Faculty.findOneAndDelete({ id }, { session });
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete faculty');
    }
    await User.deleteOne({ id });
    await session.commitTransaction();
    await session.endSession();

    try {
      if (result) {
        await RedisClient.publish(
          EVENT_FACULTY_DELETED,
          JSON.stringify(result),
        );
      }
    } catch (error) {
      console.error('Error publishing to Redis:', error);
    }

    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const FacultyService = {
  getSingleFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
};
