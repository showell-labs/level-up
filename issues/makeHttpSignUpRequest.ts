//Issues:
// 1. Signing up with account "John&Son" seems to fail for some reason when using makeHttpSignUpRequest.
// 2. Also, someone messed the authentication in the recent commit and it doesn't seem to work with our OAuth 2 based API.

//Initial Thoughts with Issue #1,
//looking at the name John&Son I'm assuming that the "&" charachter is messing up with the contents's body when sending a request
//upon quick research that guess is confirmed. and to fix this issue I propose two solutions 
//1. when creating the account ensure the names do not include any special characters that could messing with request body
// I do not like this solution because as its not really solving the bug. ++ we are seeing now with likes of elon musks baby that names might have special characters.
//2. Therefore we should create a function to ensure that the account name can be "translated" so the "computer" can understand that the accountname has special characters and can handle its

//Initial Thoughts with Issue #2,
//Something is wrong with the way we are sending data to the Oauth 2 based API.
//in order to fix this I will need to lookover the oauth 2 based api documentation to ensure we are doing doing things properly;

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
