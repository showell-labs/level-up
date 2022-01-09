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
