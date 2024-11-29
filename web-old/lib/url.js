export function isPublicPath(pathname) {
  return ["/login", "/register", "/"].includes(pathname);
}
