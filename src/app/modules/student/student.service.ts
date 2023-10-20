/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { SortOrder } from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';
import { IStudent, IStudentFilters } from './student.interface';
import { Student } from './student.model';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import {
  EVENT_STUDENT_DELETED,
  EVENT_STUDENT_UPDATED,
  studentSearchableFields,
} from './student.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { RedisClient } from '../../../shared/redis';

const getSingleStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findById(id)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty');
  return result;
};

const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: studentSearchableFields.map(field => ({
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
  const result = await Student.find(whereConditions)
    .populate('academicSemester')
    .populate('academicDepartment')
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);
  const total = await Student.countDocuments(whereConditions);
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const updateStudent = async (
  id: string,
  payload: Partial<IStudent>,
): Promise<IStudent | null> => {
  const isExist = await Student.find({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  const { name, guardian, localGuardian, ...studentData } = payload;
  const updatedStudentData: Partial<IStudent> = { ...studentData };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach(key => {
      const nameKey = `name.${key}` as keyof Partial<IStudent>; // `name.fisrtName`
      (updatedStudentData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  if (guardian && Object.keys(guardian).length > 0) {
    Object.keys(guardian).forEach(key => {
      const guardianKey = `name.${key}` as keyof Partial<IStudent>; // `name.fisrtName`
      (updatedStudentData as any)[guardianKey] =
        guardian[key as keyof typeof guardian];
    });
  }

  if (localGuardian && Object.keys(localGuardian).length > 0) {
    Object.keys(localGuardian).forEach(key => {
      const localGuardianKey = `name.${key}` as keyof Partial<IStudent>; // `name.fisrtName`
      (updatedStudentData as any)[localGuardianKey] =
        localGuardian[key as keyof typeof localGuardian];
    });
  }
  const result = await Student.findOneAndUpdate({ id }, updatedStudentData, {
    new: true,
  })
    .populate('academicFaculty')
    .populate('academicDepartment')
    .populate('academicSemester');

  try {
    if (result) {
      await RedisClient.publish(EVENT_STUDENT_UPDATED, JSON.stringify(result));
    }
  } catch (error) {
    console.error('Error publishing to Redis:', error);
  }

  return result;
};

const deleteStudent = async (id: string): Promise<IStudent | null> => {
  const isExist = await Student.find({ id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Student not found');
  }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const result = await Student.findOneAndDelete({ id }, { session });
    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Failed to delete student');
    }
    await User.deleteOne({ id });
    await session.commitTransaction();
    await session.endSession();

    try {
      if (result) {
        await RedisClient.publish(
          EVENT_STUDENT_DELETED,
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

export const StudentService = {
  getSingleStudent,
  getAllStudents,
  updateStudent,
  deleteStudent,
};
