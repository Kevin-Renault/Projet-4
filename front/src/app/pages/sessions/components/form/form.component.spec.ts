import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockSessionApiService: Partial<jest.Mocked<SessionApiService>>;
  let mockTeacherService: Partial<jest.Mocked<TeacherService>>;
  let mockRouter: { navigate: jest.Mock; url: string };

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
  let mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: activatedRouteSnapshotMock
  };
  let mockMatSnackBar: Partial<jest.Mocked<MatSnackBar>>;

  const NAME_FIELD = 'name';
  const DATE_FIELD = 'date';
  const TEACHER_ID_FIELD = 'teacher_id';
  const DESCRIPTION_FIELD = 'description';

  const TEST_SESSION_NAME = 'Test Session';
  const TEST_DATE = '2023-01-01';
  const TEST_DESCRIPTION = 'Test description';

  const NEW_SESSION_NAME = 'New Session';
  const NEW_DESCRIPTION = 'New description';

  const UPDATED_SESSION_NAME = 'Updated Session';
  const UPDATED_DESCRIPTION = 'Updated description';
  const UPDATED_DATE = '2023-01-02';


  const mockSession = {
    id: 1,
    name: TEST_SESSION_NAME,
    date: new Date(TEST_DATE),
    teacher_id: 1,
    description: TEST_DESCRIPTION,
    users: [1, 2]
  };

  const mockTeachers = [{ id: 1, name: 'Teacher 1' }];

  beforeEach(async () => {
    mockSessionService = {
      sessionInformation: { admin: true }
    } as jest.Mocked<SessionService>;
    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      create: jest.fn().mockReturnValue(of(mockSession)),
      update: jest.fn().mockReturnValue(of(mockSession))
    } as Partial<jest.Mocked<SessionApiService>>;

    mockTeacherService = {
      all: jest.fn().mockReturnValue(of(mockTeachers))
    } as Partial<jest.Mocked<TeacherService>>;

    mockRouter = {
      navigate: jest.fn(),
      url: '/sessions/create'
    };

    mockMatSnackBar = {
      open: jest.fn()
    } as Partial<jest.Mocked<MatSnackBar>>;
    paramMap.get = (key: string) => key === 'id' ? '1' : null;
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        BrowserAnimationsModule,
        FormComponent
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
      .overrideComponent(FormComponent, {
        set: {
          providers: [
            { provide: MatSnackBar, useValue: mockMatSnackBar }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  // Test d'initialisation en mode création
  it('should initialize form in create mode', () => {
    mockRouter.url = '/sessions/create';
    fixture.detectChanges();
    expect(component.onUpdate).toBe(false);
    expect(component.sessionForm).toBeDefined();
    expect(component.sessionForm?.get(NAME_FIELD)?.value).toBe('');
    expect(component.sessionForm?.get(DATE_FIELD)?.value).toBe('');
    expect(component.sessionForm?.get(TEACHER_ID_FIELD)?.value).toBe('');
    expect(component.sessionForm?.get(DESCRIPTION_FIELD)?.value).toBe('');
  });

  // Test d'initialisation en mode mise à jour
  it('should initialize form in update mode', () => {
    mockRouter.url = '/sessions/update/1';
    fixture.detectChanges();
    expect(component.onUpdate).toBe(true);
    expect(mockSessionApiService.detail).toHaveBeenCalledWith('1');
    expect(component.sessionForm?.get(NAME_FIELD)?.value).toBe(TEST_SESSION_NAME);
    expect(component.sessionForm?.get(DATE_FIELD)?.value).toBe(TEST_DATE);
    expect(component.sessionForm?.get(TEACHER_ID_FIELD)?.value).toBe(1);
    expect(component.sessionForm?.get(DESCRIPTION_FIELD)?.value).toBe(TEST_DESCRIPTION);
  });

  // Test de destruction du composant
  it('should complete destroy$ on ngOnDestroy', () => {
    fixture.detectChanges();
    const destroySpy = jest.spyOn(component['destroy$'], 'next');
    const completeSpy = jest.spyOn(component['destroy$'], 'complete');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });

  // Test des validateurs du formulaire
  it('should have required validators and maxLength validator for description', () => {
    mockRouter.url = '/sessions/create';
    fixture.detectChanges();
    const nameControl = component.sessionForm?.get(NAME_FIELD);
    const dateControl = component.sessionForm?.get(DATE_FIELD);
    const teacherControl = component.sessionForm?.get(TEACHER_ID_FIELD);
    const descControl = component.sessionForm?.get(DESCRIPTION_FIELD);

    nameControl?.setValue('');
    dateControl?.setValue('');
    teacherControl?.setValue('');
    descControl?.setValue('');

    expect(nameControl?.valid).toBe(false);
    expect(dateControl?.valid).toBe(false);
    expect(teacherControl?.valid).toBe(false);
    expect(descControl?.valid).toBe(false);

    const longDesc = 'a'.repeat(2001);
    descControl?.setValue(longDesc);
    expect(descControl?.valid).toBe(false);
  });
});
