import express from 'express';
import { KeycloakSessionConfig } from '@social-media-platform/common-config';
import { createProxyMiddleware } from 'http-proxy-middleware';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const { keycloak, session } = KeycloakSessionConfig();
const proxyConfig = {
  changeOrigin: true,
  on: {
    error: (err, req, res) => {
      console.error('Proxy Error: ', err);
      res.status(500).json({ message: 'Internal server error' });
    },
  },
};

app.use(session());
app.use(keycloak.middleware());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Open auth routes
['/register', '/login', '/refresh'].forEach((path) => {
  app.post(
    path,
    createProxyMiddleware({
      target: `${process.env.USER_SERVICE_URL}`,
      pathRewrite: { [`^${path}`]: `/auth${path}` },
      ...proxyConfig,
    })
  );
});

// Open profiles route
app.use(
  '/public-profiles',
  createProxyMiddleware({
    target: `${process.env.USER_SERVICE_URL}/public/profiles`,
    ...proxyConfig,
  })
);

// Open posts endpoint
app.use(
  '/public-posts',
  createProxyMiddleware({
    target: `${process.env.POST_SERVICE_URL}/public/posts`,
    ...proxyConfig,
  })
);

// Open routes for File Service
app.use(
  '/public-files',
  createProxyMiddleware({
    target: `${process.env.FILE_SERVICE_URL}/public/files`, // URL of the post service
    ...proxyConfig,
  })
);

// Protected routes for User Service
['/users', '/friendships', '/profiles'].forEach((path) => {
  app.use(
    path,
    keycloak.protect((token) => {
      return token.hasRole('realm:user') || token.hasRole('realm:admin');
    }),
    createProxyMiddleware({
      target: `${process.env.USER_SERVICE_URL}${path}`, // URL of the post service
      ...proxyConfig,
    })
  );
});

// Protected routes for Post Service
['/posts', '/comments', '/likes'].forEach((path) => {
  app.use(
    path,
    keycloak.protect((token) => {
      return token.hasRole('realm:user') || token.hasRole('realm:admin');
    }),
    createProxyMiddleware({
      target: `${process.env.POST_SERVICE_URL}${path}`, // URL of the post service
      ...proxyConfig,
    })
  );
});

// Protected routes for File Service
['/avatars', '/medias'].forEach((path) => {
  app.use(
    path,
    keycloak.protect((token) => {
      return token.hasRole('realm:user') || token.hasRole('realm:admin');
    }),
    createProxyMiddleware({
      target: `${process.env.FILE_SERVICE_URL}${path}`, // URL of the post service
      ...proxyConfig,
    })
  );
});

// Fallback route to catch access-denied errors
app.use((err, req, res, next) => {
  console.error('Error in request:', err);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
