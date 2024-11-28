import { KeycloakRequest } from './types';

export function extractUserSub(req: KeycloakRequest): string {
  return req.kauth.grant.access_token.content.sub as string;
}
export function extractUserName(req: KeycloakRequest): string {
  return req.kauth.grant.access_token.content.preferred_username as string;
}
