# Yoga App - Testez et améliorez une application full-stack

Application de gestion de séances de yoga avec un back-end Spring Boot et un front-end Angular.

## 🚀 Installation et lancement

### Prérequis

- **Node.js** (version 18+)
- **npm** ou **yarn**
- **Java** (version 21)
- **Maven** (version 3.6+)

### Back-end (Spring Boot)

1. **Naviguer vers le dossier back-end :**
   ```bash
   cd back/
   ```

2. **Installer les dépendances et lancer l'application :**
   ```bash
   mvn spring-boot:run
   ```

   L'API sera disponible sur `http://localhost:8080`

3. **Vérifier les tests et la couverture (recommandé) :**
   ```bash
   mvn verify
   ```
   Cette commande exécute tous les tests et vérifie le pourcentage de couverture (JaCoCo).
   
   Le rapport HTML JaCoCo est généré dans :
   `back/target/site/jacoco/index.html`

### Front-end (Angular)

1. **Naviguer vers le dossier front-end :**
   ```bash
   cd front/
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer l'application en mode développement :**
   ```bash
   npm start
   # ou
   ng serve
   ```

   L'application sera disponible sur `http://localhost:4200`

### Lancement complet

Pour lancer l'application complète :

1. **Terminal 1 - Back-end :**
   ```bash
   cd back/
   mvn spring-boot:run
   ```

2. **Terminal 2 - Front-end :**
   ```bash
   cd front/
   npm start
   ```

## 🧪 Tests

### Tests unitaires et d'intégration du front (Jest)   

Les tests Jest sont des tests d'intégration qui testent les composants Angular avec leurs services et modules.
Placez-vous toujours dans le dossier front
```bash
cd front/
```
#### Lancer tous les tests unitaires :
```bash
npm test
```

#### Lancer les tests en mode watch (recharge automatique) :
```bash
npm run test:watch
```

#### Générer le rapport de couverture Jest :
```bash
npm test -- --coverage
```

Le rapport sera généré dans `front/coverage/jest/lcov-report/index.html`

### Tests end-to-end (Cypress)

Les tests e2e testent l'application complète du point de vue utilisateur.
Ici, le travail se fait également dans le dossier front
```bash
cd front/
```

#### Lancer Cypress en mode interactif :
```bash
npm run cypress:open
```

#### Lancer les tests e2e en mode headless (CI) :
```bash
npm run e2e:ci
```

#### Lancer les tests e2e avec Cypress directement :
```bash
npx cypress run
```

## 📊 Rapports de couverture

### Couverture des tests e2e (Cypress)

Après l'exécution des tests e2e, le rapport de couverture est généré automatiquement :

1. **Lancer les tests e2e avec couverture :**
   ```bash
   cd front/
   npm run e2e:ci
   ```

2. **Ouvrir le rapport HTML :**
   - Le rapport est généré dans `front/coverage/lcov-report/index.html`
   - Ouvrez ce fichier dans votre navigateur pour voir la couverture détaillée

   **Méthodes alternatives pour ouvrir le rapport (spécifique WSL/Windows) :**
   - **Via serveur local Python (recommandé) :**
     ```bash
     cd front/coverage/lcov-report/
     python3 -m http.server 8000
     ```
     Puis ouvrez `http://localhost:8000` dans votre navigateur. Cette méthode fonctionne dans tous les environnements et permet une navigation complète.
   - **Ou directement via URL WSL (spécifique à votre configuration WSL Ubuntu) :**
     Ouvrez cette URL dans votre navigateur : `file://wsl.localhost/Ubuntu/home/vin_enault/OpenClassrooms/Testez-et-am-liorez-une-application-full-stack/front/coverage/lcov-report/index.html`

3. **Rapport texte dans le terminal :**
   ```bash
   npm run e2e:coverage
   ```

### Couverture des tests unitaires (Jest)

1. **Générer et voir le rapport :**
   ```bash
   cd front/
   npm test -- --coverage
   ```

2. **Ouvrir le rapport HTML :**
   - Rapport disponible dans `front/coverage/jest/lcov-report/index.html`

   **Méthodes alternatives pour ouvrir le rapport (spécifique WSL/Windows) :**
   - **Via serveur local Python (recommandé) :**
     ```bash
     cd front/coverage/jest/lcov-report/
     python3 -m http.server 8000
     ```
     Puis ouvrez `http://localhost:8000` dans votre navigateur. Cette méthode fonctionne dans tous les environnements et permet une navigation complète.
   - **Ou directement via URL WSL (spécifique à votre configuration WSL Ubuntu) :**
     Ouvrez cette URL dans votre navigateur : `file://wsl.localhost/Ubuntu/home/vin_enault/OpenClassrooms/Testez-et-am-liorez-une-application-full-stack/front/coverage/jest/lcov-report/index.html`

## 📁 Structure du projet

```
.
├── back/                          # Back-end Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── compose.yaml
├── front/                         # Front-end Angular
│   ├── src/
│   ├── cypress/                   # Tests e2e
│   │   ├── e2e/
│   │   └── coverage.webpack.ts
│   ├── coverage/                  # Rapports de couverture
│   ├── package.json
│   └── angular.json
├── FicheBristol.md                # Documentation projet
└── README.md                      # Ce fichier
```

## 🔧 Scripts disponibles

### Front-end
- `npm start` : Lance l'application en développement
- `npm test` : Tests unitaires avec Jest
- `npm run test:watch` : Tests en mode watch
- `npm run e2e:ci` : Tests e2e en mode CI
- `npm run cypress:open` : Interface Cypress
- `npm run lint` : Vérification du code

### Back-end
- `mvn spring-boot:run` : Lance l'application Spring Boot
- `mvn test` : Tests unitaires Java
- `mvn verify` : Vérifie la conformité des tests et le % de couverture (JaCoCo)

## 📈 Métriques de couverture

- **Tests e2e (Cypress)** : 99.23% couverture globale
  - Statements: 99.23% (520/524)
  - Branches: 97.72% (86/88)
  - Functions: 98.92% (92/93)
  - Lines: 98.94% (376/380)
- **Tests unitaires/intégration (Jest)** : 100% couverture complète
  - Statements: 100% (272/272)
  - Branches: 100% (13/13)
  - Functions: 100% (63/63)
  - Lines: 100% (246/246)
- **Tests unitaires JUnit/Mockito** : TODO (back-end Spring Boot)

## 🤝 Contribution

1. Créer une branche pour vos modifications
2. Écrire des tests pour les nouvelles fonctionnalités
3. S'assurer que tous les tests passent
4. Générer les rapports de couverture
5. Commiter avec des messages descriptifs

## 🛠️ Dépannage rapide

- **Ports utilisés** :
   - Back-end : 8080
   - Front-end : 4200
- **Nettoyer le projet Maven (back)** :
   ```bash
   cd back/
   mvn clean
   ```
- **Nettoyer les dépendances Node (front)** :
   ```bash
   cd front/
   rm -rf node_modules package-lock.json
   npm install
   ```
- **Problèmes fréquents** :
   - **Port déjà utilisé** : arrêter l’application ou changer le port dans la config.
   - **Erreur Java version** : vérifier que vous utilisez Java 21 (`java -version`).
   - **Erreur Node/npm** : vérifier la version (`node -v`, `npm -v`).
   - **Tests qui échouent après un pull** : refaire un nettoyage (`mvn clean`, `npm install`).

- **Erreur Docker/WSL2 lors du lancement du back** :

   - Si le message d'erreur indique que la commande `docker` est introuvable ou que Docker n'est pas disponible dans WSL2, deux solutions :
      - Installer Docker et activer l'intégration WSL2 dans Docker Desktop.
      - Lancer Docker Desktop et vérifier que l'intégration WSL2 y est bien activée.

   **Exemple d'erreur rencontrée :**
   ```
   The command 'docker' could not be found in this WSL 2 distro.
   We recommend to activate the WSL integration in Docker Desktop settings.

   For details about using Docker Desktop with WSL 2, visit:
   https://docs.docker.com/go/wsl2/
   ```

- **Lancer les tests e2e sans le back** :
      - Il est possible de lancer les tests end-to-end (e2e) même si le backend n'est pas démarré. Cependant, presque tous les tests échoueront ou seront en erreur si le back n'est pas accessible.
      - Pour de meilleurs résultats, assurez-vous que le backend est bien lancé avant d'exécuter les tests e2e.