
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { UserService } from './user.service';
import { User } from '../models/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser1: User = {
    id: 1,
    email: 'john.doe@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: false,
    password: 'password123',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02')
  };

  const mockUser2: User = {
    id: 2,
    email: 'jane.smith@example.com',
    lastName: 'Smith',
    firstName: 'Jane',
    admin: true,
    password: 'password456',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-04')
  };

  const mockUsers: User[] = [mockUser1, mockUser2];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call delete and return the deleted user', () => {
    // Appeler la méthode et s'abonner
    service.delete('1').subscribe((user) => {
      expect(user).toEqual(mockUser1); // Vérifier que la réponse correspond
    });

    // Vérifier que la requête HTTP a été faite
    const req1 = httpMock.expectOne('api/user/1'); // Vérifie l'URL avec l'id
    expect(req1.request.method).toBe('DELETE'); // Vérifie la méthode HTTP

    req1.flush(mockUser1);
  });

  it('should call detail and return one user', () => {
    // Appeler la méthode et s'abonner
    service.getById("1").subscribe((user) => {
      expect(user).toEqual(mockUsers[0]); // Vérifier que les données correspondent
    });

    // Vérifier que la requête HTTP a été faite
    const req1 = httpMock.expectOne('api/user/1'); // Vérifie l'URL
    expect(req1.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req1.flush(mockUsers[0]);

    service.getById("2").subscribe((user) => {
      expect(user).toEqual(mockUsers[1]); // Vérifier que les données correspondent
    });
    // Vérifier que la requête HTTP a été faite
    const req2 = httpMock.expectOne('api/user/2'); // Vérifie l'URL
    expect(req2.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req2.flush(mockUsers[1]);
  });
});
