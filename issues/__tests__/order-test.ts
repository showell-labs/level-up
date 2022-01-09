import { OrderProcessor, OrderQueue, Mailer, Database } from '../order';

const MOCK_ORDER = {
  id: 'abc',
  date: new Date(),
  recipients: 'john@google.com;jane@google.com',
  cancelled: false,
  contents: 'Item1\nItem2',
  processed: false,
};

describe('order-module', () => {
  let processor: OrderProcessor;
  let queue: OrderQueue;
  let mockMailer: Mailer;
  let mockDatabase: Database;

  beforeEach(() => {
    mockMailer = {
      sendEmail: jest.fn(() => Promise.resolve()),
    };

    mockDatabase = {
      update: jest.fn(() => Promise.resolve()),
    };

    processor = new OrderProcessor(mockMailer, mockDatabase);
    queue = new OrderQueue(processor);
  });

  describe('OrderProcessor', () => {
    test('process order', async () => {
      expect(await processor.orderProcessor({ ...MOCK_ORDER })).toHaveProperty(
        'processed',
        true
      );
    });

    test('process cancelled order', async () => {
      const order = await processor.orderProcessor({
        ...MOCK_ORDER,
        cancelled: true,
      });

      expect(order).toHaveProperty('processed', false);
    });

    test('send confirmation email', async () => {
      await processor.sendConfirmationMail(
        {
          ...MOCK_ORDER,
          processed: true,
        },
        'john@google.com'
      );

      expect(mockMailer.sendEmail).toHaveBeenCalledWith(
        'john@google.com',
        MOCK_ORDER.contents
      );
    });

    test('send confirmation email with invalid email', async () => {
      return expect(
        processor.sendConfirmationMail(
          {
            ...MOCK_ORDER,
            processed: true,
          },
          'johngoogle.com'
        )
      ).rejects.toThrowError('Invalid email');
    });
  });

  describe('OrderQueue', () => {
    test('process order', async () => {
      queue.addOrder({ ...MOCK_ORDER });
      await queue.processNextBatch();

      expect(queue.getProcessedOrders()[0]).toEqual({
        ...MOCK_ORDER,
        processed: true,
      });
    });

    test('add multiple orders (batch size + 1) and process twice', async () => {
      for (let i = 0; i < 6; i++) {
        queue.addOrder({ ...MOCK_ORDER });
      }

      await queue.processNextBatch();
      expect(queue.getProcessedOrders().length).toBe(5);

      await queue.processNextBatch();
      expect(queue.getProcessedOrders().length).toBe(6);
    });
  });
});
