import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { Teacher } from '../models/teacher.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpTestingController: HttpTestingController;


  const mockTeacher1: Teacher = { id: 1, lastName: 'Yoda', firstName: 'TheOne', createdAt: new Date(), updatedAt: new Date() };
  const mockTeacher2: Teacher = { id: 2, lastName: 'Sensei', firstName: 'ThePro', createdAt: new Date(), updatedAt: new Date() };

  const mockTeachers: Teacher[] = [mockTeacher1, mockTeacher2];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TeacherService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();  // Ajouté pour vérifier les requêtes
  });

  it('should call all and return an array of teachers', () => {
    // Appeler la méthode et s'abonner
    service.all().subscribe((teachers) => {
      expect(teachers).toEqual(mockTeachers); // Vérifier que les données correspondent
    });
    // Vérifier que la requête HTTP a été faite
    const req = httpTestingController.expectOne('api/teacher'); // Vérifie l'URL
    expect(req.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req.flush(mockTeachers);
  });

  it('should call detail and return one teacher', () => {
    // Appeler la méthode et s'abonner
    service.detail("1").subscribe((teacher) => {
      expect(teacher).toEqual(mockTeachers[0]); // Vérifier que les données correspondent
    });

    // Vérifier que la requête HTTP a été faite
    const req1 = httpTestingController.expectOne('api/teacher/1'); // Vérifie l'URL
    expect(req1.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req1.flush(mockTeachers[0]);

    service.detail("2").subscribe((teacher) => {
      expect(teacher).toEqual(mockTeachers[1]); // Vérifier que les données correspondent
    });
    // Vérifier que la requête HTTP a été faite
    const req2 = httpTestingController.expectOne('api/teacher/2'); // Vérifie l'URL
    expect(req2.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req2.flush(mockTeachers[1]);
  });
});
