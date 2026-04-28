# spz-stance
> Vehicle suspension/stance editor · `v1.0.8`

## Scripts

| Side   | File              | Purpose                                                  |
| ------ | ----------------- | -------------------------------------------------------- |
| Shared | `config.lua`      | Stance limits, allowed vehicles, configuration           |
| Client | `client/main.lua` | Suspension/wheel offset editing, NUI bridge, persistence |
| Server | `server/main.lua` | Save and restore stance data, client state sync          |

## NUI

**Stack:** Vite · Preact · TypeScript · spz-ui

> Note: this resource uses `html/` instead of the standard `ui/` folder.

```
html/
├── src/
│   ├── app.tsx
│   ├── components/       # spz-ui components
│   └── styles/
├── audio/                # UI feedback sounds (*.ogg)
└── dist/                 # built output (served by FiveM)
    └── index.html
```

Build: `cd html && npm run build`

## CI
Built and released via `.github/workflows/release.yml` on push to `main`.
