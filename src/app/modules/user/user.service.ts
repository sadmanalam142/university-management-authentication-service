import mongoose from 'mongoose';
import config from '../../../config';
import { AcademicSemester } from '../academicSemester/acdemicSemester.model';
import { IStudent } from '../student/student.interface';
import { IUser } from './user.interface';
import { generateStudentId } from './user.utils';
import { Student } from '../student/student.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';
import { User } from './user.model';
import { IAcademicSemester } from '../academicSemester/academicSemester.interface';

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
  );
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
    session.commitTransaction();
    session.endSession();
  } catch (error) {
    session.abortTransaction();
    session.endSession();
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

export const UserService = {
  createStudent,
};
