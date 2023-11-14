import z from "zod";

export interface CreateCourseInputDto {
  idToEdit: string;
  id: string;
  name: string;
  lessons: number;
}

export interface CreateCourseOutputDto {
  message: string;
  course: {
    id: string;
    name: string;
    lessons: number;
    createdAt: string;
  };
}

export const CreateCourseSchema = z
  .object({
    idToEdit: z
      .string({
        required_error: "'idToEdit' deve existir",
        invalid_type_error: "'idToEdit' deve ser uma string",
      })
      .min(1)
      .optional(),
    id: z
      .string({
        required_error: "'id' deve ser maior de 4 existir",
        invalid_type_error: "'idToEdit' deve ser uma string",
      })
      .min(4,"'id' deve ser maior ou igual a 4 ",)
      .optional(),
    name: z
      .string({
        required_error: "'id' deve ser maior de 2 existir",
        invalid_type_error: "'idToEdit' deve ser uma string",
      })
      .min(2)
      .optional(),
    lessons: z
      .number({
        required_error: "'id' deve ser maior de 1 existir",
        invalid_type_error: "'idToEdit' deve ser uma number",
      })
      .min(1)
      .optional(),
  })
  .transform((data) => data as CreateCourseInputDto);
