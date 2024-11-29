import { Request } from 'express';
import Keycloak from 'keycloak-connect';

// Extend the Keycloak Token type to include the 'content' property
declare module 'keycloak-connect' {
  interface TokenContent {
    sub: string;
    aud: string[];
    exp: number;
    iat: number;
    iss: string;
    [key: string]: unknown; // Add other possible properties dynamically if needed
  }
  interface Token {
    content: TokenContent;
  }
}

export interface KeycloakRequest extends Request {
  kauth?: {
    grant?: Keycloak.Grant;
  };
}

export interface AuthenticatedRequest extends Request {
  user?: Keycloak.TokenContent;
}
