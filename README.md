# maas-school-front-public

A production-ready Vue 3 template with a clean, layered architecture designed for scalability and maintainability.

## Tech Stack

- **Vue 3** (Composition API)
- **TypeScript** (Strict mode)
- **Vite** (Fast build tool)
- **Pinia** (State management)
- **Vue Router** (Routing)
- **Vue i18n** (Internationalization)
- **Vitest** (Unit testing)
- **Testing Library** (Component testing)
- **Playwright** (E2E testing)
- **ESLint** (Code linting)
- **Stylelint** (CSS/SCSS linting - BEM)
- **Prettier** (Code formatting)
- **Sass** (CSS preprocessing)

## SecDevOps Baseline

Este template incluye baseline operativo para despliegue en plataforma:

1. `AGENTS.md` con reglas de entrega y seguridad.
2. `.drone.yml` para CI/CD trunk-based (`master`) con promociones.
3. `Dockerfile` + `deploy/swarm/app-stack.yml`.
4. Endpoints runtime en NGINX:
   - `/health`
   - `/ready`

---

## Architecture

This project follows a strict layered architecture with clear separation of concerns:

### **core/** - Business logic and external integrations

- **api/**: Infrastructure and communication with external services
    - `config/`: API configuration (base URLs, endpoints)
    - `http/`: HTTP client implementation
    - `[domain]/`: Domain-specific API calls
- **domain/**: Pure business models and rules (NO IO allowed)
    - Domain entities and business logic
    - Pure functions only
- **services/**: Use cases and orchestration logic
    - Coordinates API calls and domain logic
    - Contains mappers to transform API data to domain models

### **store/** - State management

- Organized by domain/feature
- Each store contains:
    - `state/`: Initial state definition
    - `getters/`: Computed state
    - `actions/`: State mutations and async operations

### **shared/** - Reusable UI code

- **components/**: Pure UI components (no business logic)
- **composables/**: Reusable UI logic
- **modules/**: Complex reusable sections (UI + logic)
- **utils/**: Generic utility functions

### **helpers/** - Testing utilities

- Test helpers and utilities
- Custom renderers for component testing
- Test factories and builders
- Mock utilities

### **views/** - Application pages

- Top-level route components
- Can use: stores, services, shared components
- Cannot: call API directly

---

## Architecture Principles

✅ **DO:**

- Keep domain pure (no IO operations)
- Use services to orchestrate business logic
- Access data through stores in views
- Write isolated, testable code

❌ **DON'T:**

- Put IO operations in domain layer
- Call APIs directly from views
- Add business logic to stores
- Access stores directly from composables

---

## Data Flow

```
User Action → View → Store → Service → API → External Service
                ↓       ↓        ↓       ↓
            Component  State   Domain  HTTP
```

**Example flow:**

1. User clicks button in a **View**
2. View calls a **Store action**
3. Store action calls a **Service**
4. Service calls **API** and uses **Domain** logic
5. Service returns processed data
6. Store updates state
7. View reactively updates

---

## What is IO?

**IO (Input/Output)** is any interaction between your code and the **outside world**.

### IO examples

- API calls (fetch, axios, HTTP requests)
- LocalStorage or IndexedDB access
- WebSockets
- File system operations
- Timers (setTimeout, setInterval)
- Date.now(), Math.random()

### NOT IO

- Pure calculations
- Data transformations
- Domain business rules
- Pure functions that always return the same output for the same input

### Quick rule

**If a function depends on something external or produces side effects, it's doing IO.**

The domain layer MUST NOT contain any IO operations. All IO should be in the API layer or services.

---

## AI-Assisted Development

To maintain architecture consistency and improve AI code generation quality, review these guides before requesting changes:

### Core Documentation

- [AI Rules](docs/ai/AI_RULES.md) - Layer rules and data flow
- [Architecture Enforcement](docs/ai/ARCHITECTURE_ENFORCEMENT.md) - Violation severity levels
- [Spec Guidelines](docs/ai/SPEC_GUIDELINES.md) - How to write effective specs
- [Feature Spec Template](docs/ai/FEATURE_SPEC_TEMPLATE.md) - Template for new features

### Conventions

- [Architecture Conventions](docs/ai/conventions/ARCHITECTURE_CONVENTIONS.md)
- [Code Conventions](docs/ai/conventions/CODE_CONVENTIONS.md)
- [Layer Responsibilities](docs/ai/conventions/LAYER_RESPONSIBILITIES.md)
- [Naming Conventions](docs/ai/conventions/NAMING_CONVENTIONS.md)
- [Testing Conventions](docs/ai/conventions/TESTING_CONVENTIONS.md)
- [PR Guidelines](docs/ai/conventions/PR_GUIDELINES.md)

### Pre-coding Checklist

Before requesting AI to write code:

- [ ] Define which layer the change belongs to (domain, services, store, UI)
- [ ] Verify no IO in domain layer
- [ ] Verify no business logic in store/views
- [ ] Confirm proper data flow (UI → store → services → api/domain)
- [ ] Write or reference a spec for complex features

---

## Getting Started

### Installation

```bash
npm install
```

### Internal Packages (`@softour/*`)

If this frontend uses internal packages from Verdaccio, configure npm first:

```bash
cp .npmrc.example .npmrc
npm adduser --registry https://npm.softoursistemas.com --auth-type=legacy
npm whoami --registry https://npm.softoursistemas.com
```

Do not commit registry tokens or credentials.

### Environment variables

```bash
cp .env.example .env
```

### Development

```bash
npm run dev
```

### Type Checking

```bash
# Check types without emitting files
npm run type-check
```

### Testing

```bash
# Run unit tests in watch mode
bun run test

# Run unit tests with coverage
bun run coverage

# Run E2E tests (generates from BDD features, then runs)
bun run test:e2e

# Generate Playwright tests from .feature files (run after editing features/steps)
bun run test:e2e:gen

# Run E2E tests with UI mode (run test:e2e:gen first if you changed features)
bun run test:e2e:ui

# Debug E2E tests
bun run test:e2e:debug
```

E2E tests use **BDD (Gherkin)** via [playwright-bdd](https://github.com/vitalets/playwright-bdd): write scenarios in `src/__e2e__/features/**/*.feature` and step definitions in `src/__e2e__/steps/**/*.ts`. Generated tests go to `.features-gen/`.

### Linting

```bash
# Check JavaScript/TypeScript errors
npm run lint

# Auto-fix JavaScript/TypeScript errors
npm run lint:fix

# Check CSS/SCSS errors (BEM naming)
npm run lint:styles

# Auto-fix CSS/SCSS errors
npm run lint:styles:fix
```

### Formatting

```bash
# Format all files with Prettier
npm run format

# Check formatting without changes
npm run format:check
```

### Build

```bash
# Type check and build for production
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Git Hooks

This project uses [Husky](https://typicode.github.io/husky/) to run automated checks before each commit:

### Pre-commit Workflow

1. **ESLint** auto-fixes code style issues
2. **Unit tests** (Vitest) run to ensure code quality
3. **E2E tests** (Playwright) run in headless mode across all browsers
4. If all checks pass, the commit is allowed

To skip hooks in emergencies (not recommended):

```bash
git commit --no-verify -m "message"
```

See [.husky/README.md](.husky/README.md) for detailed information.

---

## Project Structure

```
src/
├── core/
│   ├── api/
│   │   ├── config/        # API configuration
│   │   ├── http/          # HTTP client
│   │   └── [domain]/      # Domain-specific APIs
│   ├── domain/
│   │   └── [domain]/      # Business models & rules (NO IO)
│   └── services/
│       └── [domain]/      # Use cases & orchestration
├── store/
│   └── [domain]/          # State management by feature
│       ├── state/
│       ├── getters/
│       └── actions/
├── shared/
│   ├── components/        # Reusable UI components
│   ├── composables/       # Reusable composition functions
│   ├── modules/           # Complex reusable sections
│   └── utils/             # Utility functions
├── helpers/               # Test utilities & helpers
├── views/
│   └── [ViewName]/        # Application pages/routes
├── assets/                # Static assets
├── locale/                # i18n translations
├── App.vue                # Root component
├── main.js                # Application entry point
└── routes.js              # Route definitions
```

---

## Next Steps

1. Define your domain models in `core/domain/`
2. Create API clients in `core/api/`
3. Implement services in `core/services/`
4. Set up stores in `store/`
5. Build views in `views/`
6. Create reusable components in `shared/components/`

Remember: Follow the architecture principles and review the AI rules before implementing new features!

---

## Operational Docs

1. `docs/operacion.md`
2. `docs/infra-o11y.md`
3. `docs/LOGGING_STANDARD.md`

---

## License

MIT
