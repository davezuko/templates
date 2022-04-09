## Building the Project

All build scripts are stored in the [./scripts](./scripts) directory. You're welcome to run these scripts directly with node, but I suggest using the npm scripts shown below for convenience.

```sh
# Start the development server.
# Default flags: --devtools
npm run start

# Build for production with all optimizations enabled.
# Default flags: --minify --strip-console
npm run build

# Build while preserving development tools, e.g. console logs.
# Default flags: --devtools --minify=0
npm run build-dev

# Serve the built application locally.
npm run serve

# Check code health.
npm run check-typescript
npm run check-eslint

# Run a full CI build.
npm run ci

# Advanced configuration
# Pass these flags along with your command to change its default behavior.
#
# --minify={0,1}         minify output files?
# --split={0,1}          split output files into separate chunks?
# --react={0,1}          use react instead of preact?
# --verbose              show extra verbose logs?
#
# Usage:
# --flag                 enable the flag (shorthand for --flag=1)
# --flag=1               enable the flag
# --flag=0               disable the flag
```
