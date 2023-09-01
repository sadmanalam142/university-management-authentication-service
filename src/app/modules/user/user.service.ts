import mongoose from 'mongoose';
import config from '../../../config';
import { AcademicSemester } from '../academicSemester/acdemicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import { Student } from '../student/student.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from './user.model';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { IFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { IAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';

// creating user and student
const createStudent = async (
  student: IStudent,
  user: IUser,
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }

  user.role = 'student';

  const academicsemester = await AcademicSemester.findById(
    student.academicSemester,
  ).lean();
  let newUserData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const id = await generateStudentId(academicsemester as IAcademicSemester);
    user.id = id;
    student.id = id;
    const createdStudent = await Student.create([student], { session });
    if (!createdStudent.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }
    user.student = createdStudent[0]._id;
    const createdUser = await User.create([user], { session });
    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    newUserData = createdUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserData) {
    newUserData = await User.findOne({ id: newUserData.id }).populate({
      path: 'student',
      populate: [
        {
          path: 'academicFaculty',
        },
        {
          path: 'academicDepartment',
        },
        {
          path: 'academicSemester',
        },
      ],
    });
  }

  return newUserData;
};

// creating user and faculty
const createFaculty = async (
  faculty: IFaculty,
  user: IUser,
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }

  user.role = 'faculty';
  let newUserData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const id = await generateFacultyId();
    user.id = id;
    faculty.id = id;
    const createdFaculty = await Faculty.create([faculty], { session });
    if (!createdFaculty.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }
    user.faculty = createdFaculty[0]._id;
    const createdUser = await User.create([user], { session });
    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    newUserData = createdUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserData) {
    newUserData = await User.findOne({ id: newUserData.id }).populate({
      path: 'faculty',
      populate: [
        {
          path: 'academicFaculty',
        },
        {
          path: 'academicDepartment',
        },
      ],
    });
  }

  return newUserData;
};

// creating user and admin
const createAdmin = async (
  admin: IAdmin,
  user: IUser,
): Promise<IUser | null> => {
  // default password
  if (!user.password) {
    user.password = config.default_user_pass as string;
  }

  user.role = 'admin';
  let newUserData = null;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const id = await generateAdminId();
    user.id = id;
    admin.id = id;
    const createdAdmin = await Admin.create([admin], { session });
    if (!createdAdmin.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    user.admin = createdAdmin[0]._id;
    const createdUser = await User.create([user], { session });
    if (!createdUser.length) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    newUserData = createdUser[0];
    await session.commitTransaction();
    await session.endSession();
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }

  if (newUserData) {
    newUserData = await User.findOne({ id: newUserData.id }).populate({
      path: 'admin',
      populate: [
        {
          path: 'managementDepartment',
        },
      ],
    });
  }

  return newUserData;
};

export const UserService = {
  createStudent,
  createFaculty,
  createAdmin,
};
