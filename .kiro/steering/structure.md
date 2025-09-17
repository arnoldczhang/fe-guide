# Project Structure & Organization

## Root Directory Layout

```
fe-guide/
├── src/                    # Main source code organized by technology/topic
├── test/                   # Test files and configurations
├── tasks/                  # Build and setup scripts
├── worker/                 # Web worker implementations
├── _book/                  # Generated documentation (GitBook)
├── .storybook/            # Storybook configuration
├── journals/              # Personal learning journals
├── logseq/               # Logseq knowledge management
└── pages/                # Static pages content
```

## Source Code Organization (`src/`)

The `src/` directory follows a **topic-based structure** where each subdirectory represents a specific technology, concept, or domain:

### Technology Categories
- **Frontend Frameworks**: `react/`, `vue/`, `angular/`, `preact/`
- **Build Tools**: `webpack/`, `babel/`, `rollup/`, `esbuild/`, `parcel/`
- **Languages**: `typescript/`, `javascript/`, `python/`, `rust/`
- **Styling**: `css-related/`, `less/`, `postcss/`
- **Backend**: `node/`, `koa/`, `mongodb/`, `mysql/`, `pg/`
- **Testing**: `test/`, `test-tools/`, `unit-test/`
- **Algorithms**: `algorithm/`, `sicp/`
- **Career**: `career/`, `fe-interview/`

### File Naming Conventions
- **README.md** - Main documentation for each topic
- **Chinese filenames** - Many files use Chinese names (e.g., `被追赶的经济体.md`)
- **Kebab-case** - Directory names use lowercase with hyphens
- **Descriptive names** - Files clearly indicate their purpose

## Documentation Structure

### GitBook Integration
- `SUMMARY.md` - Table of contents for GitBook
- `_book/` - Generated static site
- Cross-references between topics using relative paths

### Learning Materials
- **README.md files** - Comprehensive guides for each technology
- **Example code** - Practical implementations and demos
- **Reference links** - External resources and documentation
- **Personal notes** - Learning experiences and insights

## Configuration Files Location

### Root Level Configs
- Build tools: `webpack.config.js`, `tsconfig.json`, `.babelrc`
- Code quality: `.eslintrc.js`, `.editorconfig`
- Package management: `package.json`, `yarn.lock`, `pnpm-lock.yaml`
- CI/CD: `.travis.yml`

### Directory-Specific Configs
- Each `src/` subdirectory may contain its own configuration files
- Storybook config in `.storybook/`
- Test configurations in `test/`

## Content Organization Principles

1. **Topic Isolation** - Each technology/concept has its own directory
2. **Self-Contained** - Each directory includes documentation, examples, and configs
3. **Cross-Referencing** - Liberal use of relative links between related topics
4. **Bilingual Support** - Mix of English and Chinese content
5. **Practical Focus** - Emphasis on working examples and real-world applications

## File Types & Purposes

- **`.md`** - Documentation, tutorials, learning notes
- **`.js/.ts`** - Code examples, implementations, utilities
- **`.json`** - Configuration files, data samples
- **`.html`** - Demo pages, templates
- **`.css/.less`** - Styling examples and utilities

## Navigation Patterns

- Start with main `README.md` for project overview
- Each `src/` subdirectory has its own `README.md` as entry point
- Use relative links for cross-references (e.g., `../webpack/README.md`)
- SUMMARY.md provides structured navigation for GitBook