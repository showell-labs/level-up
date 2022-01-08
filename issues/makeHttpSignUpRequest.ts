/**
 * Issue
 *
 * Signing up with account "John&Son" seems to fail for some reason.
 * Also, someone messed the authentication in the recent commit and
 * it doesn't seem to work with our OAuth 2 based API.
 *
 * Note, that our API supports both JSON and Form data.
 */

export function makeHttpSignUpRequest(
  bearerToken: string,
  accountName: string,
  email: string,
  contentType: "form" | "json"
): string {
  let body = "";

  if (contentType === "form") {
    body = `name=${accountName}&userEmail=${email}`;
  } else {
    body = JSON.stringify({ name: accountName, userEmail: email });
  }

  return `POST /1/sign-up HTTP/1.1
    Host: api.myapp
    Authentication: Basic ${bearerToken}
    Content-Type: application/x-www-form-urlencoded
    Content-Length: ${body.length}
    
    ${body}`;
}
