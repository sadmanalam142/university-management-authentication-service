import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_DEPARTMENT_CREATED,
  EVENT_ACADEMIC_DEPARTMENT_DELETED,
  EVENT_ACADEMIC_DEPARTMENT_UPDATED,
} from './academicDepartment.constant';
import { AcademicDepartmentCreatedEvent } from './academicDepartment.interface';
import { academicDepartmentService } from './academicDepartment.service';

const initAcademicDepartmentEvents = () => {
  RedisClient.subscribe(
    EVENT_ACADEMIC_DEPARTMENT_CREATED,
    async (e: string) => {
      const data: AcademicDepartmentCreatedEvent = JSON.parse(e);

      await academicDepartmentService.createAcademicDepartmentFromEvent(data);
    },
  );

  RedisClient.subscribe(
    EVENT_ACADEMIC_DEPARTMENT_UPDATED,
    async (e: string) => {
      const data: AcademicDepartmentCreatedEvent = JSON.parse(e);

      await academicDepartmentService.updatAcademicDepartmentFromEvent(data);
    },
  );

  RedisClient.subscribe(
    EVENT_ACADEMIC_DEPARTMENT_DELETED,
    async (e: string) => {
      const data: AcademicDepartmentCreatedEvent = JSON.parse(e);

      await academicDepartmentService.deleteAcademicDepartmentFromEvent(
        data.id,
      );
    },
  );
};

export default initAcademicDepartmentEvents;
