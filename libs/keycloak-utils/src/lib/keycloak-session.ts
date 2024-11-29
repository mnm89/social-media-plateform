import Session from 'express-session';
import KeycloakConnect from 'keycloak-connect';

import { RequestHandler } from 'express';
interface IKeycloakSessionConfig {
  store: Session.MemoryStore;
  session: () => RequestHandler;
  keycloak: KeycloakConnect.Keycloak;
}

export function KeycloakSessionConfig(): IKeycloakSessionConfig {
  const store = new Session.MemoryStore();
  return {
    store,
    session: () =>
      Session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store,
      }),
    keycloak: new KeycloakConnect(
      { store },
      {
        realm: process.env.KEYCLOAK_REALM,
        'auth-server-url': process.env.KEYCLOAK_SERVER_URL,
        'ssl-required': 'external',
        resource: process.env.KEYCLOAK_CLIENT_ID,
        'confidential-port': 0,
        'bearer-only': true,
      }
    ),
  };
}
