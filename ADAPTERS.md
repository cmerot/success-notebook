# Platform Adapters

This project uses an adapter pattern to support both Tauri (desktop) and Web (browser) environments with a single codebase.

## Architecture

### Storage Adapter (`lib/adapters/storage/`)

Provides persistent key-value storage:

- **Tauri**: Uses `@tauri-apps/plugin-store` for file-based storage
- **Web**: Uses IndexedDB for browser-based storage

**Usage:**

```typescript
import { getStorageAdapter } from '$lib/adapters/storage';

const storage = await getStorageAdapter();
await storage.set('key', value);
const value = await storage.get('key');
```

### File Operations Adapter (`lib/adapters/file-operations/`)

Provides file download/save and dialog operations:

- **Tauri**: Uses native file system dialogs (`@tauri-apps/plugin-dialog` and `@tauri-apps/plugin-fs`)
- **Web**: Uses browser download APIs and native `confirm()` dialogs

**Usage:**

```typescript
import { getFileOperationsAdapter } from '$lib/adapters/file-operations';

const fileOps = await getFileOperationsAdapter();
const path = await fileOps.showSaveDialog({ defaultPath: 'file.json' });
if (path) {
	await fileOps.writeTextFile(path, content);
}
```

## Runtime Detection

The adapters automatically detect the runtime environment by checking for `window.__TAURI__`:

- If present → Tauri adapter is loaded
- If absent → Web adapter is loaded

## Dynamic Imports

Tauri-specific code is loaded via dynamic imports to prevent bundling Tauri dependencies in web builds. This avoids runtime errors when Tauri APIs are unavailable in browsers.

## Building for Different Platforms

### Tauri Build (Desktop)

```bash
bun run tauri dev   # Development
bun run tauri build # Production
```

### Web Build (Browser)

```bash
bun run dev     # Development
bun run build   # Production
```

Both builds use the same source code. The adapter system handles platform differences automatically at runtime.

## Adding New Platform-Specific Features

1. Create an interface in `lib/adapters/[feature]/interface.ts`
2. Implement Tauri adapter in `lib/adapters/[feature]/tauri-adapter.ts`
3. Implement Web adapter in `lib/adapters/[feature]/web-adapter.ts`
4. Create factory with runtime detection in `lib/adapters/[feature]/index.ts`
5. Use dynamic imports for Tauri-specific code

## Testing

- **Tauri**: Run `bun run tauri dev` and test desktop functionality
- **Web**: Run `bun run dev` and test in a browser at `http://localhost:1420`

Both environments should work without modifications to the source code.
