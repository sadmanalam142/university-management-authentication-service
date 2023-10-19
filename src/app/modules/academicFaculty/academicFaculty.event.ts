import { RedisClient } from '../../../shared/redis';
import {
  EVENT_ACADEMIC_FACULTY_CREATED,
  EVENT_ACADEMIC_FACULTY_DELETED,
  EVENT_ACADEMIC_FACULTY_UPDATED,
} from './academicFaculty.constant';
import { AcademicFacultyCreatedEvent } from './academicFaculty.interface';
import { academicFacultyService } from './academicFaculty.service';

const initAcademicFacultyEvents = () => {
  RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_CREATED, async (e: string) => {
    const data: AcademicFacultyCreatedEvent = JSON.parse(e);

    await academicFacultyService.createAcademicFacultyFromEvent(data);
  });

  RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_UPDATED, async (e: string) => {
    const data: AcademicFacultyCreatedEvent = JSON.parse(e);

    await academicFacultyService.updateAcademicFacultyFromEvent(data);
  });

  RedisClient.subscribe(EVENT_ACADEMIC_FACULTY_DELETED, async (e: string) => {
    const data: AcademicFacultyCreatedEvent = JSON.parse(e);

    await academicFacultyService.deleteAcademicFacultyFromEvent(data.id);
  });
};

export default initAcademicFacultyEvents;
