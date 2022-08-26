import { makeHttpSignUpRequest } from '../makeHttpSignUpRequest';

const MOCK_SIGNUP = {
  bearerToken: 'exampleBearerToken',
  accountName: 'John&Sons',
  email: 'example@google.com',
};
describe('Make Sign up Request', () => {
  test('with form format', () => {
    const body = `name=John%26Sons&userEmail=${MOCK_SIGNUP.email}`;
    expect(
      makeHttpSignUpRequest(
        MOCK_SIGNUP.bearerToken,
        MOCK_SIGNUP.accountName,
        MOCK_SIGNUP.email,
        'form'
      )
    ).toEqual(`POST /1/sign-up HTTP/1.1
    Host: api.myapp
    Authentication: Basic exampleBearerToken
    Content-Type: application/x-www-form-urlencoded
    Content-Length: ${body.length}
    ${body}`);
  });

  test('with json format', () => {
    const bodyJSON = JSON.stringify({
      name: MOCK_SIGNUP.accountName,
      userEmail: MOCK_SIGNUP.email,
    });

    expect(
      makeHttpSignUpRequest(
        MOCK_SIGNUP.bearerToken,
        MOCK_SIGNUP.accountName,
        MOCK_SIGNUP.email,
        'json'
      )
    ).toEqual(`POST /1/sign-up HTTP/1.1
    Host: api.myapp
    Authentication: Basic exampleBearerToken
    Content-Type: application/json
    Content-Length: ${bodyJSON.length}
    ${bodyJSON}`);
  });
});
