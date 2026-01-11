# Fiche Bristol - Testing Angular Complet

## Vue d'ensemble
Guide complet pour écrire des tests unitaires Angular maintenables avec Jest, en utilisant des constantes et des bonnes pratiques.

## 1. Principes de base des tests Angular

### Structure d'un test
```typescript
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;
  let mockService: jest.Mocked<Service>;

  beforeEach(async () => {
    // Configuration TestBed
    await TestBed.configureTestingModule({
      imports: [/* modules nécessaires */],
      providers: [/* mocks des services */]
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
  });

  it('should do something', () => {
    // Arrange - Act - Assert
  });
});
```

### Injection de dépendances
- **Constructeur** : `constructor(private service: Service)`
- **`inject()`** : `private service = inject(Service)`

> **Important** : Pour `inject()`, utiliser `.overrideComponent()` dans les tests.

## 2. Constantes en UPPER_SNAKE_CASE

### Pourquoi utiliser des constantes ?
- Évite la duplication de code
- Facilite la maintenance
- Réduit les erreurs de frappe
- Améliore la lisibilité

### Exemples de constantes

#### Pour les noms de champs
```typescript
const NAME_FIELD = 'name';
const DATE_FIELD = 'date';
const TEACHER_ID_FIELD = 'teacher_id';
const DESCRIPTION_FIELD = 'description';
```

#### Pour les données de test
```typescript
const TEST_SESSION_NAME = 'Test Session';
const TEST_DATE = '2023-01-01';
const TEST_DESCRIPTION = 'Test description';
const NEW_SESSION_NAME = 'New Session';
const UPDATED_SESSION_NAME = 'Updated Session';
```

#### Pour les IDs et autres valeurs
```typescript
const TEST_SESSION_ID = '1';
const TEST_USER_ID = '1';
const TEST_TEACHER_ID = '1';
```

## 3. Configuration TestBed

### Structure complète
```typescript
await TestBed.configureTestingModule({
  imports: [
    RouterTestingModule,           // Pour le routing
    HttpClientTestingModule,       // Pour les appels HTTP
    ReactiveFormsModule,           // Pour les formulaires réactifs
    MatSnackBarModule,             // Pour les notifications
    ComponentUnderTest             // Le composant à tester
  ],
  providers: [
    { provide: Service, useValue: mockService },
    { provide: ActivatedRoute, useValue: mockActivatedRoute }
  ]
})
.overrideComponent(ComponentUnderTest, {
  set: {
    providers: [
      { provide: MatSnackBar, useValue: mockMatSnackBar }
    ]
  }
})
.compileComponents();
```

### overrideComponent() - Cas d'usage
**Quand l'utiliser ?**
- Quand le composant utilise `inject()` au lieu du constructeur
- Exemple : `private snackbar = inject(MatSnackBar)`

**Pourquoi ?**
- Les providers globaux ne s'appliquent pas aux injections `inject()`
- Nécessaire pour mocker correctement ces services

## 4. Mocking des services

### Service simple
```typescript
const mockSessionService = {
  sessionInformation: { admin: true, id: 1 }
} as any;
```

### Service avec méthodes
```typescript
const mockSessionApiService = {
  detail: jest.fn().mockReturnValue(of(mockData)),
  create: jest.fn().mockReturnValue(of(mockData)),
  update: jest.fn().mockReturnValue(of(mockData)),
  delete: jest.fn().mockReturnValue(of(void 0))
} as any;
```

### ActivatedRoute (cas spécial)
```typescript
const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: jest.fn().mockReturnValue('1')
    }
  }
} as any;
```

## 5. Patterns de test courants

### Test de création
```typescript
it('should create', () => {
  fixture.detectChanges();
  expect(component).toBeTruthy();
});
```

### Test de méthodes
```typescript
it('should call service method', () => {
  component.methodName();
  expect(mockService.method).toHaveBeenCalledWith(expectedParam);
});
```

### Test de propriétés
```typescript
it('should initialize properties', () => {
  fixture.detectChanges();
  expect(component.property).toBe(expectedValue);
});
```

### Test asynchrone
```typescript
it('should handle async operation', () => {
  component.asyncMethod();
  expect(mockService.asyncMethod).toHaveBeenCalled();
  // Vérifier les effets secondaires
});
```

### Test de formulaire
```typescript
it('should set form value', () => {
  component.sessionForm?.setValue({
    [NAME_FIELD]: TEST_SESSION_NAME,
    [DATE_FIELD]: TEST_DATE
  });
  expect(component.sessionForm?.get(NAME_FIELD)?.value).toBe(TEST_SESSION_NAME);
});
```

## 6. Assertions Jest

### Méthodes de service
```typescript
expect(mockService.method).toHaveBeenCalledWith(param1, param2);
expect(mockService.method).toHaveBeenCalledTimes(1);
```

### Valeurs de propriétés
```typescript
expect(component.property).toBe(expectedValue);
expect(component.property).toEqual(expectedObject);
expect(component.property).toBeTruthy();
```

### Formulaires
```typescript
expect(component.sessionForm?.valid).toBe(true);
expect(component.sessionForm?.get(NAME_FIELD)?.value).toBe(TEST_SESSION_NAME);
```

## 7. Gestion de l'asynchrone

### Observables
```typescript
mockService.method.mockReturnValue(of(expectedData));
```

### Erreurs
```typescript
mockService.method.mockReturnValue(throwError(() => new Error('Test error')));
```

### fakeAsync/tick (pour les timers)
```typescript
it('should handle timeout', fakeAsync(() => {
  component.method();
  tick(1000);
  expect(component.done).toBe(true);
}));
```

## 8. Bonnes pratiques

### Organisation du code
- Constantes en haut du describe
- Mock data séparés
- beforeEach pour la configuration commune
- Noms de test descriptifs

### Maintenance
- Utiliser des constantes pour éviter la duplication
- Tester les chemins heureux ET d'erreur
- Vérifier les appels de service
- Tester les effets secondaires (navigation, notifications)

### Debugging
- Vérifier la configuration TestBed en premier
- S'assurer que les mocks sont correctement configurés
- Utiliser `console.log()` pour déboguer
- Vérifier l'ordre des appels

## 9. Concepts clés à maîtriser

### Injection de dépendances
- Différence constructeur vs `inject()`
- Quand utiliser `.overrideComponent()`

### TestBed configuration
- imports vs providers vs declarations
- Ordre d'exécution

### Asynchrone
- `of()`, `throwError()` pour les Observables
- `fakeAsync()`, `tick()` pour les timers
- `fixture.whenStable()` pour les changements

### Services Angular courants
- Router : `RouterTestingModule`
- HttpClient : `HttpClientTestingModule`
- ActivatedRoute : mock manuel
- MatSnackBar : overrideComponent souvent nécessaire

### Formulaires
- ReactiveFormsModule
- setValue() vs patchValue()
- Validation testing

## 10. Checklist avant de pousser

- [ ] Tous les tests passent (`ng test --watch=false`)
- [ ] Coverage > 80% (idéalement 100% pour les composants)
- [ ] Constantes utilisées pour éviter la duplication
- [ ] Mocks complets pour tous les services
- [ ] Tests d'erreur inclus
- [ ] Code review : lisibilité et maintenabilité

## Exemples complets

### Test de composant avec formulaire
```typescript
describe('FormComponent', () => {
  // Constantes
  const TEST_SESSION_NAME = 'Test Session';
  const NEW_SESSION_NAME = 'New Session';

  // Mocks
  const mockSessionApiService = {
    create: jest.fn().mockReturnValue(of({})),
    update: jest.fn().mockReturnValue(of({}))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormComponent],
      providers: [
        { provide: SessionApiService, useValue: mockSessionApiService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
  });

  it('should create session', () => {
    component.sessionForm?.setValue({
      [NAME_FIELD]: NEW_SESSION_NAME
    });
    component.submit();
    expect(mockSessionApiService.create).toHaveBeenCalledWith({
      name: NEW_SESSION_NAME
    });
  });
});
```

### Test de composant avec routing
```typescript
describe('DetailComponent', () => {
  const mockRouter = { navigate: jest.fn() };
  const mockActivatedRoute = {
    snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  it('should navigate on delete', () => {
    component.delete();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });
});
```

---

**Rappel** : Cette fiche couvre les concepts essentiels pour maîtriser les tests Angular. Pratique régulièrement et consulte la documentation officielle pour les détails avancés.