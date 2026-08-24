# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploying to Netlify

1. Set your backend URL in `netlify.toml` under `context.production.environment.BACKEND_URL`.
2. Replace the placeholder in `public/_redirects` (`https://your-backend.example.com`) with your actual backend URL, or configure redirects in the Netlify UI.
3. Push your frontend to a Git provider (GitHub/GitLab/Bitbucket) and connect the repository in the Netlify dashboard.
	- Build command: `npm run build`
	- Publish directory: `dist`
4. Alternatively, install the Netlify CLI and run:

```
npm run build
npx netlify deploy --prod --dir=dist
```

Note: Netlify hosts static frontends. Deploy the FastAPI backend to a platform like Render, Fly, Heroku, or Vercel (as a separate service), then set that URL in Netlify so your frontend can call the API.
