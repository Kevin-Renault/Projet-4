import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { SessionService } from 'src/app/core/service/session.service';
import { UserService } from 'src/app/core/service/user.service';
import { expect } from '@jest/globals';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockUserService: jest.Mocked<UserService>;
  let mockSessionService: jest.Mocked<SessionService>;
  let mockRouter: jest.Mocked<Router>;
  let mockMatSnackBar: jest.Mocked<any>;
  const mockUser = {
    id: 1,
    email: 'test@example.com',
    lastName: 'Doe',
    firstName: 'John',
    admin: true,
    password: 'password',
    createdAt: new Date()
  };
  const mockSessionInfo = {
    admin: true,
    id: 1
  };

  beforeEach(async () => {
    const userServiceMock = {
      getById: jest.fn(),
      delete: jest.fn()
    };

    const sessionServiceMock = {
      sessionInformation: mockSessionInfo,
      logOut: jest.fn()
    };

    const routerMock = {
      navigate: jest.fn()
    };

    const matSnackBarMock = {
      open: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [
        MeComponent,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: matSnackBarMock }
      ],
    })
      .overrideComponent(MeComponent, {
        set: {
          providers: [
            { provide: MatSnackBar, useValue: matSnackBarMock }
          ]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;

    mockUserService = TestBed.inject(UserService) as jest.Mocked<UserService>;
    mockSessionService = TestBed.inject(SessionService) as jest.Mocked<SessionService>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
    mockMatSnackBar = TestBed.inject(MatSnackBar) as jest.Mocked<any>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call window.history.back when back() is called', () => {
    // Spy on window.history.back
    const backSpy = jest.spyOn(window.history, 'back').mockImplementation(() => { });

    // Call the method
    component.back();

    // Expect the spy to have been called
    expect(backSpy).toHaveBeenCalled();

    // Clean up the spy
    backSpy.mockRestore();
  });

  it('should delete user account and navigate on successful deletion', fakeAsync(() => {
    // Mock the delete method to return an observable that emits the deleted user
    mockUserService.delete.mockReturnValue(of(mockUser));

    // Call the delete method
    component.delete();

    // Flush the async operations
    tick();

    // Expect the userService.delete to have been called with correct id
    expect(mockUserService.delete).toHaveBeenCalledWith('1');

    // Expect the snackbar to have been opened
    expect(mockMatSnackBar.open).toHaveBeenCalledWith(
      "Your account has been deleted !",
      'Close',
      { duration: 3000 }
    );

    // Expect logout to have been called
    expect(mockSessionService.logOut).toHaveBeenCalled();

    // Expect navigation to home
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  }));
});
