import express from 'express';
import { KeycloakSessionConfig } from '@social-media-platform/common-config';
import routes from './routes';
import bootstrap from './bootstrap';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
const { keycloak, session } = KeycloakSessionConfig();

app.use(session());
app.use(keycloak.middleware());
app.use(express.json());

app.use('/', routes);

app.listen(port, host, async () => {
  await bootstrap();
  console.log(`[ ready ] http://${host}:${port}`);
});
