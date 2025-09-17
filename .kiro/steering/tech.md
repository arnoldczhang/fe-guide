# Technology Stack & Build System

## Core Technologies

### Frontend Frameworks & Libraries
- **React** 16.12.0 - Primary frontend framework
- **Vue.js** - Alternative frontend framework (with Vue components)
- **TypeScript** - Type-safe JavaScript development
- **Babel** - JavaScript transpilation with presets for React and ES6+

### Build Tools & Bundlers
- **Webpack** - Primary module bundler with custom configurations
- **ESBuild** - Fast JavaScript bundler (alternative)
- **Rollup** - Module bundler for libraries
- **Parcel** - Zero-configuration build tool

### Development Tools
- **ESLint** - Code linting with Airbnb configuration
- **Prettier** - Code formatting
- **Husky** - Git hooks management
- **lint-staged** - Run linters on staged files

### Testing & Quality
- **AVA** - Test runner for JavaScript
- **Nightwatch** - End-to-end testing framework
- **Mocha** - JavaScript test framework
- **Storybook** - Component development environment

### Package Management
- **npm/yarn/pnpm** - Package managers
- **Node.js** - Runtime environment

## Common Commands

### Development
```bash
# Install dependencies
npm install
# or
yarn install

# Run tests
npm test
npm run test:debug
npm run test:ndb

# Linting
npm run lint:fix

# Build with webpack
npx webpack
npx webpack --watch

# Commit with conventional commits
npm run commit
```

### Build & Bundle
```bash
# Webpack build
webpack --mode=production
webpack --mode=development

# Source map analysis
npm run source

# Storybook
npm run storybook
```

## Configuration Files

### Core Config Files
- `package.json` - Project dependencies and scripts
- `webpack.config.js` - Webpack bundling configuration
- `tsconfig.json` - TypeScript compiler options
- `.babelrc` - Babel transpilation settings
- `.eslintrc.js` - ESLint rules (Airbnb + Prettier)

### Environment Files
- `.browserslistrc` - Browser compatibility targets
- `.postcssrc` - PostCSS configuration
- `.npmrc` - npm configuration
- `nightwatch.conf.js` - E2E testing configuration

## Build System Notes

- Uses ES modules (`"type": "module"` in package.json)
- Webpack configured for multiple entry points
- Babel setup for React and modern JavaScript features
- ESLint with Airbnb style guide and Prettier integration
- Support for both CommonJS and ES modules
- TypeScript compilation to `./dist` directory