import { Request } from 'express';
import Keycloak from 'keycloak-connect';

// Extend the Keycloak Token type to include the 'content' property
declare module 'keycloak-connect' {
  interface Token {
    content: {
      sub: string;
      aud: string[];
      exp: number;
      iat: number;
      iss: string;
      [key: string]: unknown; // Add other possible properties dynamically if needed
    };
  }
}

export interface KeycloakRequest extends Request {
  kauth?: {
    grant?: Keycloak.Grant;
  };
}
