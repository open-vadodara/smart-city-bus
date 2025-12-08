# Plot React

Minimal React + Vite app that recreates the functionality from `plot.html` and adds a left panel to show one route at a time.

Quick start

1. Change to the `plot-react` directory:

```bash
cd plot-react
```

2. Install dependencies:

```bash
npm install
```

3. Run the dev server:

```bash
npm run dev
```

Notes

- The app expects the `route_details` directory to be available at the project root (same level as `plot-react`). The dev server must serve that directory so the app can fetch `route_details/` and individual `tt_*.json` files.
- If fetching the directory listing doesn't work on your server, you can update `src/App.jsx` to provide routes manually or host a small JSON file with the list.
