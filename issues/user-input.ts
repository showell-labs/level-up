// Find out why our error database is filling with following error when using savePassword/Age in user-input module:
// 'value' is not a string or number (VerySimpleDatabase.insert)
// Also, double-check that the functions are otherwise correct.

// Write unit tests for the functions, there don't seem to be any at the moment.

//Initial thoughts --> type issue being created 
//could be trying submit a null or undefined value
//parseINt could be trying to  submit a null or undefined value 

interface VerySimpleDatabase {
  insert(key: string, value: string | number): void;
}

export function savePassword(
  database: VerySimpleDatabase,
  httpPostParams: {password: string}
) {
  database.insert('password', httpPostParams.password);
}

export function saveAge(
  database: VerySimpleDatabase,
  httpPostParams: {age : string}
) {
  database.insert('age', parseInt(httpPostParams.age));
}

