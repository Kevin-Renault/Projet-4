import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionApiService } from './session-api.service';
import { Session } from '../models/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;

  const mockSession1: Session =
    { id: 1, name: 'Yoga Session', description: 'Relaxing yoga', date: new Date(), teacher_id: 1, users: [] };
  const mockSession2: Session =
    { id: 2, name: 'Pilates Session', description: 'Core workout', date: new Date(), teacher_id: 2, users: [] };

  const mockSessions: Session[] = [mockSession1, mockSession2];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // Module pour mocker HttpClient
      providers: [SessionApiService]
    })
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Ajouté pour vérifier les requêtes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all and return an array of sessions', () => {
    // Appeler la méthode et s'abonner
    service.all().subscribe((sessions) => {
      expect(sessions).toEqual(mockSessions); // Vérifier que les données correspondent
    });
    // Vérifier que la requête HTTP a été faite
    const req = httpMock.expectOne('api/session'); // Vérifie l'URL
    expect(req.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req.flush(mockSessions);
  });

  it('should call detail and return one session', () => {
    // Appeler la méthode et s'abonner
    service.detail("1").subscribe((session) => {
      expect(session).toEqual(mockSessions[0]); // Vérifier que les données correspondent
    });

    // Vérifier que la requête HTTP a été faite
    const req1 = httpMock.expectOne('api/session/1'); // Vérifie l'URL
    expect(req1.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req1.flush(mockSessions[0]);

    service.detail("2").subscribe((session) => {
      expect(session).toEqual(mockSessions[1]); // Vérifier que les données correspondent
    });
    // Vérifier que la requête HTTP a été faite
    const req2 = httpMock.expectOne('api/session/2'); // Vérifie l'URL
    expect(req2.request.method).toBe('GET'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur
    req2.flush(mockSessions[1]);
  });


  it('should call delete and return the deleted session', () => {
    // Appeler la méthode et s'abonner
    service.delete('1').subscribe((session) => {
      expect(session).toEqual(mockSession1); // Vérifier que la réponse correspond
    });

    // Vérifier que la requête HTTP a été faite
    const req1 = httpMock.expectOne('api/session/1'); // Vérifie l'URL avec l'id
    expect(req1.request.method).toBe('DELETE'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur (souvent le session supprimé ou un message)
    req1.flush(mockSession1);
  });

  it('should call create and return the created session', () => {
    // Appeler la méthode et s'abonner
    service.create(mockSession1).subscribe((session) => {
      expect(session).toEqual(mockSession1); // Vérifier que la réponse correspond
    });

    // Vérifier que la requête HTTP a été faite
    const req = httpMock.expectOne('api/session'); // Vérifie l'URL avec l'id
    expect(req.request.method).toBe('POST'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur (souvent le session supprimé ou un message)
    req.flush(mockSession1);
  });


  it('should call update and return the updated session', () => {
    // Appeler la méthode et s'abonner
    service.update("1", mockSession1).subscribe((session) => {
      expect(session).toEqual(mockSession1); // Vérifier que la réponse correspond
    });

    // Vérifier que la requête HTTP a été faite
    const req = httpMock.expectOne('api/session/1'); // Vérifie l'URL avec l'id
    expect(req.request.method).toBe('PUT'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur (souvent le session supprimé ou un message)
    req.flush(mockSession1);
  });


  it('should call participate and return the created session', () => {
    // Appeler la méthode et s'abonner
    service.participate("1", "1").subscribe((session) => {
      expect(session).toEqual(mockSession1); // Vérifier que la réponse correspond
    });

    // Vérifier que la requête HTTP a été faite
    const req = httpMock.expectOne('api/session/1/participate/1'); // Vérifie l'URL avec l'id de session et user
    expect(req.request.method).toBe('POST'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur (souvent le session supprimé ou un message)
    req.flush(mockSession1);
  });


  it('should call unparticipate and return the created session', () => {
    // Appeler la méthode et s'abonner
    service.unParticipate("1", "1").subscribe((session) => {
      expect(session).toEqual(mockSession1); // Vérifier que la réponse correspond
    });

    // Vérifier que la requête HTTP a été faite
    const req = httpMock.expectOne('api/session/1/participate/1'); // Vérifie l'URL avec l'id de session et user
    expect(req.request.method).toBe('DELETE'); // Vérifie la méthode HTTP

    // Simuler la réponse du serveur (souvent le session supprimé ou un message)
    req.flush(mockSession1);
  });

});
