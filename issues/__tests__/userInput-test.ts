import { VerySimpleDatabase, saveAge, savePassword } from '../user-input';

describe('userInputInser', () => {
  const mockInsert = jest.fn();
  const mockDatabase: VerySimpleDatabase = {
    insert: mockInsert,
  };
  test('Password insert', () => {
    mockDatabase.insert('password', 'examplePassword');

    expect(mockInsert).toHaveBeenCalledWith('password', 'examplePassword');
  });
  test('age insert', () => {
    mockDatabase.insert('age', '22');
    expect(mockInsert).toHaveBeenCalledWith('age', '22');
  });
});
