import { z } from 'zod';

const createManagementDepartmentZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'Title is required',
    }),
  }),
});

const updateManagementDepartmentZodSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
      })
      .optional(),
  }),
});

export const managementDepartmentValidation = {
  createManagementDepartmentZodSchema,
  updateManagementDepartmentZodSchema,
};
