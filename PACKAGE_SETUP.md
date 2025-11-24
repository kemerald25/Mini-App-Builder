# Package Setup Notes

## OnchainKit Package Installation

The generated Mini Apps use `@coinbase/onchainkit` for wallet and transaction functionality. 

### If packages are not yet published to npm:

You may need to install OnchainKit from the source repository or wait for official npm publication. Check the official Base documentation for the latest installation instructions:

- [Base Documentation](https://docs.base.org)
- [OnchainKit Documentation](https://docs.base.org/onchainkit)

### Installation Options:

1. **If published to npm:**
   ```bash
   npm install @coinbase/onchainkit
   ```

2. **If installing from GitHub (temporary):**
   ```bash
   npm install https://github.com/coinbase/onchainkit.git
   ```

3. **If using a different package structure:**
   Update the imports in generated files:
   - `app/layout.tsx` - OnchainKitProvider import
   - `app/page.tsx` - useMiniKit, Transaction, Wallet imports

### For the Builder Tool:

The builder tool itself doesn't require OnchainKit - it only generates code. All dependencies are only needed in the generated Mini Apps.

If you encounter issues with package installation in generated apps, refer to the latest Base documentation for the correct package names and versions.

