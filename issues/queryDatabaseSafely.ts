/**
 * Issue
 *
 * Perform security audit for this function. Fix any issues found.
 */

interface Query {
  [field: string]: string | number | Date;
}

interface Database {
  /**
   * Query database records by exact field match
   */
  query(query: Query): unknown;
}

/**
 * Perform safe database query
 *
 * This function ensures that the query returns only
 * database records that are available for currently
 * authenticated user.
 */
export default function queryDatabaseSafely(
  query: Query,
  database: Database,
  authenticatedUserId: string
) {
  let finalQuery = {};

  if (Object.keys(query).length) {
    // Fetch only records where "userId" field matches with currently
    // authenticated user ID.
    finalQuery = {
      userId: authenticatedUserId,
    };
  }

  finalQuery = { ...finalQuery, ...query };

  return database.query(finalQuery);
}
