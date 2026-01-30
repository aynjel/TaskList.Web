# TaskList.Web

A modern task management application built with Angular 21, featuring authentication, task management, and dashboard capabilities. This project follows Angular best practices with standalone components, signals for state management, and a modular architecture.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Development Guidelines](#development-guidelines)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Code Quality](#code-quality)
- [Additional Resources](#additional-resources)

## 🎯 Overview

TaskList.Web is a comprehensive task management solution that provides users with the ability to create, manage, and track tasks efficiently. The application features a secure authentication system, intuitive dashboard, and modern UI built with Tailwind CSS.

## 🛠 Tech Stack

### Core Framework

- **Angular 21.0.0** - Modern web application framework
- **TypeScript 5.9.2** - Type-safe JavaScript superset
- **RxJS 7.8.0** - Reactive programming library

### State Management

- **@ngrx/signals 21.0.1** - Modern signal-based state management
- **@ngrx/operators 21.0.1** - Reactive state operators

### UI & Styling

- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **@ng-icons/heroicons 33.0.0** - Heroicons icon library
- **ngx-toastr 20.0.4** - Toast notifications

### Development Tools

- **Angular CLI 21.0.4** - Command-line interface for Angular
- **Vitest 4.0.8** - Fast unit testing framework
- **Prettier** - Code formatter
- **PostCSS 8.5.3** - CSS transformation tool

### Build Tools

- **@angular/build 21.0.4** - Application bundler with esbuild
- **npm 11.7.0** - Package manager

## ✨ Features

### Authentication Module

- User registration with validation
- Secure login with JWT authentication
- Token refresh mechanism with silent refresh
- Protected routes with authentication guards
- Session management

### Dashboard Module

- Task summary overview
- Quick statistics and insights
- Header with user information
- Sidebar navigation

### Tasks Module

- Create, read, update, and delete tasks
- Task list with filtering and sorting
- Task details view
- Task review functionality
- File upload support
- Confirmation modals for critical actions

### Shared Features

- HTTP interceptors (JWT, error handling, caching)
- Global error pages (404, 500)
- Global state management
- Reusable models and constants
- Responsive design with accessibility (WCAG AA compliant)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** - Version 18.x or higher (recommended: latest LTS)
- **npm** - Version 11.7.0 or higher
- **Angular CLI** - Version 21.0.4 or higher
  ```bash
  npm install -g @angular/cli@21
  ```

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd TaskList.Web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   ng version
   ```

## ⚙️ Configuration

### Environment Configuration

The application uses environment-specific configuration files:

**Development Environment** (`src/environments/environment.development.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7191/api/v1/',
};
```

**Production Environment** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://localhost:7191/api/v1/',
};
```

### API Configuration

Update the `apiUrl` in the environment files to point to your backend API server.

### SSL Configuration

The project includes an `ssl/` directory for local HTTPS development. Configure SSL certificates if needed for local development.

### TypeScript Configuration

The project uses strict TypeScript settings (`tsconfig.json`):

- Strict type checking enabled
- No implicit overrides
- No fallthrough cases in switch statements
- Experimental decorators support
- ES2022 target

### Prettier Configuration

Formatting rules are defined in `package.json`:

- Print width: 100 characters
- Single quotes enabled
- Angular HTML parser for templates

## 🏃 Running the Application

### Development Server

Start the development server:

```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200/`. The app will automatically reload when you make changes to source files.

### Development Server with SSL

For HTTPS development:

```bash
ng serve --ssl
```

### Watch Mode

Build the project in watch mode:

```bash
npm run watch
```

## 📁 Project Structure

```
TaskList.Web/
├── src/
│   ├── app/
│   │   ├── modules/               # Feature modules
│   │   │   ├── auth/              # Authentication module
│   │   │   │   ├── components/    # Login, Register
│   │   │   │   ├── models/        # User models
│   │   │   │   ├── services/      # Auth service
│   │   │   │   ├── store/         # Auth store (signals)
│   │   │   │   └── auth.routes.ts # Auth routes
│   │   │   ├── dashboard/         # Dashboard module
│   │   │   │   ├── components/    # Header, Sidebar
│   │   │   │   ├── models/        # Task summary models
│   │   │   │   ├── services/      # Dashboard service
│   │   │   │   └── store/         # Dashboard store
│   │   │   ├── home/              # Home module
│   │   │   └── tasks/             # Tasks module
│   │   │       ├── components/    # Task CRUD components
│   │   │       ├── models/        # Task models
│   │   │       ├── services/      # Tasks service
│   │   │       └── store/         # Tasks store
│   │   ├── shared/                # Shared resources
│   │   │   ├── const/             # Constants (endpoints, etc.)
│   │   │   ├── guards/            # Route guards
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   ├── models/            # Shared models
│   │   │   ├── pages/             # Error pages
│   │   │   └── store/             # Global store
│   │   ├── app.component.ts       # Root component
│   │   ├── app.config.ts          # App configuration
│   │   └── app.routes.ts          # Root routes
│   ├── environments/              # Environment configs
│   ├── index.html                 # HTML entry point
│   ├── main.ts                    # TypeScript entry point
│   └── styles.css                 # Global styles
├── public/                        # Static assets
├── ssl/                           # SSL certificates
├── angular.json                   # Angular workspace config
├── package.json                   # Dependencies & scripts
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

## 🏗 Architecture

### Application Configuration (`app.config.ts`)

The application uses the following providers:

- **Router** with view transitions for smooth page changes
- **HttpClient** with fetch API and interceptors:
  - JWT Interceptor - Adds authentication tokens
  - Error Interceptor - Handles API errors globally
  - Cache Interceptor - Implements response caching
- **App Initializer** - Handles silent token refresh and splash screen
- **Toastr** - Toast notifications

### State Management

The application uses **@ngrx/signals** for reactive state management:

**Signal Stores:**

- `AuthStore` - User authentication state and methods
- `DashboardStore` - Dashboard data and statistics
- `TasksStore` - Tasks CRUD operations
- `GlobalStore` - Application-wide state

**Store Features:**

- `withState()` - Define state shape
- `withComputed()` - Derived state with signals
- `withMethods()` - State mutation methods
- `withHooks()` - Lifecycle hooks

### Routing Strategy

- **Lazy Loading** - Feature modules loaded on demand
- **Route Guards** - `authGuard` protects authenticated routes
- **View Transitions** - Smooth page navigation animations
- **Child Routes** - Nested routing for feature modules

### HTTP Interceptors

1. **JWT Interceptor** - Attaches access tokens to API requests
2. **Error Interceptor** - Handles errors and redirects to error pages
3. **Cache Interceptor** - Caches GET requests for performance

### Component Architecture

All components follow these patterns:

- **Standalone components** (no NgModules)
- **Signals** for reactive state
- **OnPush change detection** for performance
- **Input/Output functions** instead of decorators
- **Host bindings** in component metadata
- **Reactive forms** for user input

## 💻 Development Guidelines

### Code Style

1. **TypeScript**
   - Use strict type checking
   - Prefer type inference when obvious
   - Avoid `any`, use `unknown` for uncertain types

2. **Components**
   - Keep components small and focused
   - Use `input()` and `output()` functions
   - Use `computed()` for derived state
   - Set `ChangeDetectionStrategy.OnPush`

3. **Templates**
   - Use native control flow (`@if`, `@for`, `@switch`)
   - Avoid complex logic in templates
   - Use async pipe for observables
   - No arrow functions in templates

4. **State Management**
   - Use signals for local state
   - Use stores for shared state
   - Keep transformations pure
   - Use `update` or `set`, never `mutate`

### Accessibility

All components must:

- Pass AXE accessibility checks
- Follow WCAG AA standards
- Include proper ARIA attributes
- Maintain focus management
- Meet color contrast requirements

### Code Scaffolding

Generate new components:

```bash
ng generate component component-name
```

Generate new services:

```bash
ng generate service service-name
```

Generate new guards:

```bash
ng generate guard guard-name
```

For available schematics:

```bash
ng generate --help
```

## 🧪 Testing

### Unit Tests

Run unit tests with Vitest:

```bash
npm test
# or
ng test
```

### Test Files

- Component tests: `*.component.spec.ts`
- Service tests: `*.service.spec.ts`
- Guard tests: `*.guard.spec.ts`
- Interceptor tests: `*.interceptor.spec.ts`

### Testing Tools

- **Vitest** - Fast unit test runner with watch mode
- **jsdom** - DOM implementation for Node.js

## 🏗 Building for Production

### Production Build

Build the application for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

### Build Features

- **Code splitting** - Automatic chunking for optimal loading
- **Tree shaking** - Dead code elimination
- **Minification** - CSS and JavaScript minification
- **Optimization** - Performance optimizations enabled
- **Source maps** - Optional source map generation

### Build Configurations

Available configurations:

- `development` - Development build with source maps
- `production` - Production build with optimizations

Build with specific configuration:

```bash
ng build --configuration production
```

## 📊 Code Quality

### Prettier

Format code:

```bash
npx prettier --write .
```

Check formatting:

```bash
npx prettier --check .
```

### Linting

The project follows Angular style guide and TypeScript best practices.

## 📚 Additional Resources

### Official Documentation

- [Angular Documentation](https://angular.dev) - Official Angular docs
- [Angular CLI](https://angular.dev/tools/cli) - CLI command reference
- [TypeScript Handbook](https://www.typescriptlang.org/docs) - TypeScript guide
- [RxJS Documentation](https://rxjs.dev) - Reactive programming guide

### Libraries

- [NgRx Signals](https://ngrx.io/guide/signals) - Signal-based state management
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Vitest](https://vitest.dev) - Testing framework
- [ngx-toastr](https://www.npmjs.com/package/ngx-toastr) - Toast notifications

### Tools

- [Angular DevTools](https://angular.dev/tools/devtools) - Browser extension
- [VS Code Angular Extension](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) - IDE support

---

**Version:** 0.0.0  
**Generated with:** Angular CLI 21.0.4  
**Package Manager:** npm 11.7.0
