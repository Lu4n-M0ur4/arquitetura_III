import { CourseDatabase } from "../database/CourseDatabase";
import {
  CreateCourseInputDto,
  CreateCourseOutputDto,
} from "../dtos/createCourse.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { CourseDB } from "../models/Course";
import { Course } from "../models/Course";

export class CourseBusiness {
  constructor(private courseDatabase: CourseDatabase) {}

  public getCourses = async (input: any) => {
    const { q } = input;

    // const courseDatabase = new CourseDatabase();
    const coursesDB = await this.courseDatabase.findCourses(q);

    const courses: Course[] = coursesDB.map(
      (courseDB) =>
        new Course(
          courseDB.id,
          courseDB.name,
          courseDB.lessons,
          courseDB.created_at
        )
    );

    const output = courses.map((course) => ({
      id: course.getId(),
      name: course.getName(),
      lessons: course.getLessons(),
      createdAt: course.getCreatedAt(),
    }));

    return output;
  };

  public createCourse = async (input: any) => {
    const { id, name, lessons } = input;

    if (typeof id !== "string") {
      throw new BadRequestError("'id' deve ser string");
    }

    if (typeof name !== "string") {
      throw new BadRequestError("'name' deve ser string");
    }

    if (typeof lessons !== "number") {
      throw new BadRequestError("'lessons' deve ser number");
    }

    if (name.length < 2) {
      throw new BadRequestError("'name' deve possuir pelo menos 2 caracteres");
    }

    if (lessons <= 0) {
      throw new BadRequestError("'lessons' não pode ser zero ou negativo");
    }

    // const courseDatabase = new CourseDatabase();
    const courseDBExists = await this.courseDatabase.findCourseById(id);

    if (courseDBExists) {
      throw new BadRequestError("'id' já existe");
    }

    const newCourse = new Course(id, name, lessons, new Date().toISOString());

    const newCourseDB: CourseDB = {
      id: newCourse.getId(),
      name: newCourse.getName(),
      lessons: newCourse.getLessons(),
      created_at: newCourse.getCreatedAt(),
    };

    await this.courseDatabase.insertCourse(newCourseDB);

    const output = {
      message: "Curso registrado com sucesso",
      course: {
        id: newCourse.getId(),
        name: newCourse.getName(),
        lessons: newCourse.getLessons(),
        createdAt: newCourse.getCreatedAt(),
      },
    };

    return output;
  };

  public editCourse = async (
    input: CreateCourseInputDto
  ): Promise<CreateCourseOutputDto> => {
    const { idToEdit, id, name, lessons } = input;

    // const courseDatabase = new CourseDatabase();
    const courseToEditDB = await this.courseDatabase.findCourseById(idToEdit);

    if (!courseToEditDB) {
      throw new NotFoundError("'id' para editar não existe");
    }

    const course = new Course(
      courseToEditDB.id,
      courseToEditDB.name,
      courseToEditDB.lessons,
      courseToEditDB.created_at
    );

    id && course.setId(id);
    name && course.setName(name);
    lessons && course.setLessons(lessons);

    const updatedCourseDB: CourseDB = {
      id: course.getId(),
      name: course.getName(),
      lessons: course.getLessons(),
      created_at: course.getCreatedAt(),
    };

    await this.courseDatabase.updateCourse(idToEdit, updatedCourseDB);

    const output: CreateCourseOutputDto = {
      message: "Curso editado com sucesso",
      course: {
        id: course.getId(),
        name: course.getName(),
        lessons: course.getLessons(),
        createdAt: course.getCreatedAt(),
      },
    };

    return output;
  };

  public deleteCourse = async (input: any) => {
    const { idToDelete } = input;

    // const courseDatabase = new CourseDatabase();
    const courseToDeleteDB = await this.courseDatabase.findCourseById(idToDelete);

    if (!courseToDeleteDB) {
      throw new NotFoundError("'id' para deletar não existe");
    }

    const course = new Course(
      courseToDeleteDB.id,
      courseToDeleteDB.name,
      courseToDeleteDB.lessons,
      courseToDeleteDB.created_at
    );

    await this.courseDatabase.deleteCourseById(courseToDeleteDB.id);

    const output = {
      message: "Curso deletado com sucesso",
      course: {
        id: course.getId(),
        name: course.getName(),
        lessons: course.getLessons(),
        createdAt: course.getCreatedAt(),
      },
    };

    return output;
  };
}
