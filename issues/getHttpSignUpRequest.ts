/**
 * Issue
 *
 * Signing up with account "John&Son" seems to fail for some reason.
 * Also, someone messed the authentication in the recent commit and
 * it doesn't seem to work with our OAuth 2 based API.
 */

export function getHttpSignUpRequest(
  bearerToken: string,
  accountName: string,
  email: string
): string {
  const body = `name=${accountName}&userEmail=${email}`;

  return `POST /1/sign-up HTTP/1.1
    Host: api.myapp
    Authentication: Basic ${bearerToken}
    Content-Type: application/x-www-form-urlencoded
    Content-Length: ${body.length}
    
    ${body}`;
}
