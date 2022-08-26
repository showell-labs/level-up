import getTouchedAnnotation from '../getTouchedAnnotation';

describe('getTouchedAnnotation', () => {
  test('get annotation with exact touch', () => {
    const annotations = [
      { left: 0, top: 0, width: 100, height: 50, url: 'https://showell.com' },
    ];

    expect(getTouchedAnnotation({ x: 50, y: 25 }, annotations)).toBe(
      annotations[0]
    );
  });

  test('get annotation with touch between two annotations', () => {
    const annotations = [
      { left: 0, top: 0, width: 100, height: 50, url: 'https://showell.com/1' },
      {
        left: 0,
        top: 60,
        width: 200,
        height: 50,
        url: 'https://showell.com/2',
      },
      {
        left: 0,
        top: 1000,
        width: 200,
        height: 50,
        url: 'https://showell.com/3',
      },
    ];

    expect(getTouchedAnnotation({ x: 101, y: 59 }, annotations)).toBe(
      annotations[1]
    );
  });
});
