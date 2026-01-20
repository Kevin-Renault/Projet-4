import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: Partial<jest.Mocked<SessionApiService>>;
  let mockTeacherService: Partial<jest.Mocked<TeacherService>>;
  let mockRouter: Partial<jest.Mocked<Router>>;
  const paramMap: ParamMap = convertToParamMap({ id: '123' });
  const activatedRouteSnapshotMock: ActivatedRouteSnapshot = {
    paramMap,
    url: [],
    params: {},
    queryParams: {},
    queryParamMap: convertToParamMap({}),
    fragment: null,
    data: {},
    outlet: '',
    component: null,
    routeConfig: null,
    root: {} as ActivatedRouteSnapshot,
    parent: null,
    firstChild: null,
    children: [],
    pathFromRoot: [],
    toString: () => '',
    title: undefined, // ou une valeur string si besoin
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: activatedRouteSnapshotMock
  };
  let mockMatSnackBar: Partial<jest.Mocked<MatSnackBar>>;
  // Constantes pour les données de test
  const TEST_SESSION_ID = '1';
  const TEST_USER_ID = '1';
  const TEST_TEACHER_ID = '1';

  const TEST_SESSION_NAME = 'Test Session';
  const TEST_SESSION_DESCRIPTION = 'Test description';
  const TEST_SESSION_DATE = new Date('2023-01-01');

  const TEST_TEACHER_FIRST_NAME = 'John';
  const TEST_TEACHER_LAST_NAME = 'Doe';

  // Mock data
  const mockSession = {
    id: 1,
    name: TEST_SESSION_NAME,
    description: TEST_SESSION_DESCRIPTION,
    date: TEST_SESSION_DATE,
    teacher_id: 1,
    users: [1, 2]
  };

  const mockTeacher = {
    id: 1,
    firstName: TEST_TEACHER_FIRST_NAME,
    lastName: TEST_TEACHER_LAST_NAME,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: { admin: true, id: 1 }
    } as jest.Mocked<SessionService>;

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      delete: jest.fn().mockReturnValue(of(void 0)),
      participate: jest.fn().mockReturnValue(of(void 0)),
      unParticipate: jest.fn().mockReturnValue(of(void 0))
    } as Partial<jest.Mocked<SessionApiService>>;

    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of(mockTeacher))
    } as Partial<jest.Mocked<TeacherService>>;

    mockRouter = {
      navigate: jest.fn()
    } as Partial<jest.Mocked<Router>>;

    mockMatSnackBar = {
      open: jest.fn()
    } as Partial<jest.Mocked<MatSnackBar>>;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        DetailComponent
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: MatSnackBar, useValue: mockMatSnackBar }
      ]
    })
      .overrideComponent(DetailComponent, {
        set: {
          providers: [
            { provide: MatSnackBar, useValue: mockMatSnackBar }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
  });


  // Test de vérification de participation
  it('should check participation correctly', () => {
    // User participates
    mockSessionService.sessionInformation!.id = 1;
    component.ngOnInit();
    expect(component.isParticipate).toBe(true);

    // User does not participate
    mockSessionService.sessionInformation!.id = 3;
    component.ngOnInit();
    expect(component.isParticipate).toBe(false);
  });


  // Test de ngOnDestroy
  it('should complete destroy$ on ngOnDestroy', () => {
    fixture.detectChanges();
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});

