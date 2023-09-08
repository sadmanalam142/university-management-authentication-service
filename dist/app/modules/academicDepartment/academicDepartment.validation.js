'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.academicDepartmentValidation = void 0;
const zod_1 = require('zod');
const createAcademicDepartmentZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    title: zod_1.z.string({
      required_error: 'Title is required',
    }),
    academicFaculty: zod_1.z.string({
      required_error: 'Academic Faculty is required',
    }),
  }),
});
const updateAcademicDepartmentZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    title: zod_1.z
      .string({
        required_error: 'Title is required',
      })
      .optional(),
    academicFaculty: zod_1.z
      .string({
        required_error: 'Academic Faculty is required',
      })
      .optional(),
  }),
});
exports.academicDepartmentValidation = {
  createAcademicDepartmentZodSchema,
  updateAcademicDepartmentZodSchema,
};
