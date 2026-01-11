import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import { SessionInformation } from '../models/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;
  const user: SessionInformation = {
    id: 1, admin: true,
    token: '',
    type: '',
    username: '',
    firstName: '',
    lastName: ''
  };
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should return the initial isLogged state as false', (done) => {
    service.$isLogged().subscribe((isLogged) => {
      expect(isLogged).toBe(false); // Valeur initiale
      done();
    });
  });


  it('should emit true after logIn', fakeAsync(() => {
    let emittedValues: boolean[] = [];
    service.$isLogged().subscribe(val => emittedValues.push(val));

    service.logIn(user);
    tick(); // Avance le temps pour les émissions asynchrones

    expect(emittedValues).toEqual([false, true]); // Vérifie la séquence
  }));

  it('should emit false after logOut', fakeAsync(() => {
    let emittedValues: boolean[] = [];
    service.$isLogged().subscribe(val => emittedValues.push(val));
    service.logIn(user);
    service.logOut();
    tick(); // Avance le temps pour les émissions asynchrones
    expect(emittedValues).toEqual([false, true, false]); // Vérifie la séquence
  }));

});
