# Publishing to npm

This guide explains how to publish the Mini App Builder CLI to npm.

## Prerequisites

1. An npm account (sign up at https://www.npmjs.com/signup)
2. npm CLI installed (comes with Node.js)
3. Login to npm: `npm login`

## Publishing Steps

### 1. Build the Package

The package is automatically built before publishing via the `prepublishOnly` script, but you can test the build manually:

```bash
npm run build
```

This compiles TypeScript files from `src/` to `dist/` using the `tsconfig.cli.json` configuration.

### 2. Test Locally

Before publishing, test the CLI locally:

```bash
# Test the compiled CLI
node dist/cli.js

# Or test via npm link
npm link
init-builder
```

### 3. Update Version

Update the version in `package.json` according to [Semantic Versioning](https://semver.org/):

- Patch: `1.0.1` (bug fixes)
- Minor: `1.1.0` (new features, backward compatible)
- Major: `2.0.0` (breaking changes)

You can use npm version commands:

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

### 4. Publish to npm

#### First Time Publishing

```bash
npm publish --access public
```

The `--access public` flag is required for scoped packages (like `@devroyale/mini-app-builder`).

#### Subsequent Publishes

```bash
npm publish
```

### 5. Verify Publication

Check your package on npm:
- Visit: https://www.npmjs.com/package/@devroyale/miniapp

### 6. Test Installation

Test that users can install and use it:

```bash
# Test with npx (no installation)
npx @devroyale/miniapp@latest

# Or use the shorter command
npx miniapp

# Or install globally
npm install -g @devroyale/miniapp
miniapp
```

## Package Configuration

The package is configured with:

- **Name**: `@devroyale/miniapp` (scoped package)
- **Bin command**: `miniapp`
- **Entry point**: `dist/cli.js`
- **Files included**: Only `dist/`, `README.md`, and `LICENSE` (see `.npmignore`)
- **Zero runtime dependencies**: CLI uses only Node.js built-ins

## Usage After Publishing

Users can use the CLI in two ways:

### Option 1: npx (no installation)

```bash
npx init-builder
```

or

```bash
npx mini-app-builder
```

### Option 2: Global Installation

```bash
npm install -g mini-app-builder
init-builder
```

or

```bash
npm install -g mini-app-builder
mini-app-builder
```

## Package Contents

The published package includes:

- `dist/` - Compiled JavaScript files
- `README.md` - Package documentation
- `LICENSE` - MIT License

Excluded files (via `.npmignore`):

- Source TypeScript files
- Next.js web app files
- Development dependencies
- Config files
- Documentation files (except README.md)

## Troubleshooting

### Build Errors

If the build fails:
1. Check TypeScript compilation: `npm run build`
2. Verify `tsconfig.cli.json` is correct
3. Ensure all imports have `.js` extensions for ES modules

### Publishing Errors

- **Authentication**: Run `npm login`
- **Package name taken**: Update name in `package.json` (using scoped packages like `@yourusername/package-name` avoids conflicts)
- **Version conflict**: Update version number
- **Bin path errors**: Ensure bin paths don't have `./` prefix (use `dist/cli.js` not `./dist/cli.js`)

### Runtime Errors

- Ensure Node.js 18+ is installed
- Check that `dist/cli.js` has execute permissions
- Verify all files in `dist/` are included

## CI/CD Integration

To automate publishing, add to your GitHub Actions workflow:

```yaml
- name: Publish to npm
  if: startsWith(github.ref, 'refs/tags/')
  run: |
    npm publish --access public
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Updating the Package

1. Make changes to the source code
2. Test locally: `npm run build && node dist/cli.js`
3. Update version: `npm version patch|minor|major`
4. Publish: `npm publish`
5. Create a git tag: `git push --tags`

