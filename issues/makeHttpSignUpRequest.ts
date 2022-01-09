export function makeHttpSignUpRequest(
  bearerToken: string,
  accountName: string,
  email: string,
  contentType: 'form' | 'json'
): string {
  let body = '';

  if (contentType === 'form') {
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
