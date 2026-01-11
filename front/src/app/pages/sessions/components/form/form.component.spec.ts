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
import { ActivatedRoute, Router } from '@angular/router';
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
  let mockSessionApiService: jest.Mocked<SessionApiService>;
  let mockTeacherService: jest.Mocked<TeacherService>;
  let mockRouter: any;
  let mockActivatedRoute: jest.Mocked<ActivatedRoute>;
  let mockMatSnackBar: jest.Mocked<MatSnackBar>;


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
    } as any;

    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of(mockSession)),
      create: jest.fn().mockReturnValue(of(mockSession)),
      update: jest.fn().mockReturnValue(of(mockSession))
    } as any;

    mockTeacherService = {
      all: jest.fn().mockReturnValue(of(mockTeachers))
    } as any;

    mockRouter = {
      navigate: jest.fn()
    } as any;
    Object.defineProperty(mockRouter, 'url', {
      get: () => mockRouter._url || '/sessions/create',
      set: (value) => { mockRouter._url = value; },
      configurable: true
    });
    mockRouter.url = '/sessions/create';

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('1')
        }
      }
    } as any;

    mockMatSnackBar = {
      open: jest.fn()
    } as any;

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
