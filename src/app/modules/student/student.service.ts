import { SortOrder } from 'mongoose';
import { IGenericResponse } from '../../../interfaces/common';
import { IStudent, IStudentFilters } from './student.interface';
import { Student } from './student.model';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import { studentSearchableFields } from './student.constant';
import { IPaginationOptions } from '../../../interfaces/pagination';

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
  const total = await Student.countDocuments();
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// const updateStudent = async (
//   id: string,
//   payload: Partial<IStudent>,
// ): Promise<IStudent | null> => {
//   if (
//     payload.title &&
//     payload.code &&
//     academicSemesterTitleCodeMapper[payload.title] !== payload.code
//   ) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Code!');
//   }
//   const result = await Student.findOneAndUpdate({ _id: id }, payload, {
//     new: true,
//   });
//   return result;
// };

const deleteStudent = async (id: string): Promise<IStudent | null> => {
  const result = await Student.findByIdAndDelete(id);
  return result;
};

export const StudentService = {
  getSingleStudent,
  getAllStudents,
  //   updateStudent,
  deleteStudent,
};
