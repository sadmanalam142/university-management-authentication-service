'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.academicFacultyValidation = void 0;
const zod_1 = require('zod');
const createAcademicFacultyZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    title: zod_1.z.string({
      required_error: 'Title is required',
    }),
  }),
});
const updateAcademicFacultyZodSchema = zod_1.z.object({
  body: zod_1.z.object({
    title: zod_1.z
      .string({
        required_error: 'Title is required',
      })
      .optional(),
  }),
});
exports.academicFacultyValidation = {
  createAcademicFacultyZodSchema,
  updateAcademicFacultyZodSchema,
};
