import queryDatabaseSafely from "../queryDatabaseSafely";

describe("queryDatabaseSafely", () => {
  test("query with one field", () => {
    const mockQuery = jest.fn(() => [{ name: "John" }]);
    const mockDatabase = {
      query: mockQuery,
    };

    expect(
      queryDatabaseSafely({ name: "John" }, mockDatabase, "user-123")
    ).toEqual([{ name: "John" }]);

    expect(mockQuery).toHaveBeenCalledWith({
      name: "John",
      userId: "user-123",
    });
  });
});
