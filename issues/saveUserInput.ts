/**
 * Issue
 *
 * Find out why our error database is filling with following error
 * when using savePassword/Age:
 *
 * "'value' is not a string or number (VerySimpleDatabase.insert)"
 *
 * Also, double-check that the functions are otherwise correct.
 *
 * Write unit tests for the functions, there don't seem to be any at
 * the moment.
 */

interface VerySimpleDatabase {
  insert(key: string, value: string | number): void;
}

export function savePassword(
  database: VerySimpleDatabase,
  httpPostParams: Record<string, string>
) {
  database.insert("password", httpPostParams.password);
}

export function saveAge(
  database: VerySimpleDatabase,
  httpPostParams: Record<string, string>
) {
  database.insert("age", parseInt(httpPostParams.age));
}
