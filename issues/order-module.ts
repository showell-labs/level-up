/**
 * Issue
 *
 * Somehow this implementation for the order processing looks messy.
 * Perhaps there's some room for improvement here?
 *
 * Customers have reported that the order information hasn't been delivered
 * to all emails. For instance one customer reported that she had added three
 * addresses but only first one received the email.
 */

interface Order {
  id: string;
  date: Date;
  recipients: string;
  cancelled: boolean;
  contents: string;
  processed: boolean;
}

export interface Mailer {
  sendEmail(to: string, message: string): Promise<void>;
}

export interface Database {
  update(id: string, specs: Partial<Order>): Promise<void>;
}

// Very naive implementation, but sufficient for this issue
const isValidEmail = (email: string) => email.includes("@");

export class OrderProcessor {
  private mailer: Mailer;
  private orderDatabase: Database;

  constructor(mailer: Mailer, orderDatabase: Database) {
    this.mailer = mailer;
    this.orderDatabase = orderDatabase;
  }

  async orderProcessor(order?: Order): Promise<Order> {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() - 11);

    if (order && !order.cancelled && order.date > expirationDate) {
      order.processed = true;
      await this.orderDatabase.update(order.id, order);
    } else if (!order) {
      throw new Error("Order is missing");
    }

    return order;
  }

  async sendConfirmationMail(order: Order, email: string): Promise<void> {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() - 1);

    if (!order.cancelled && order.date > expirationDate) {
      if (order.processed) {
        if (isValidEmail(email)) {
          this.mailer.sendEmail(email, order.contents);
        } else {
          throw new Error("Invalid email");
        }
      }
    }
  }
}

export class OrderQueue {
  private itemArray: Order[] = [];
  private processed: Order[] = [];
  private processor: OrderProcessor;
  private process = false;
  private MaxItemsToProcess;

  constructor(processor: OrderProcessor) {
    this.processor = processor;
    this.MaxItemsToProcess = 5;
  }

  public addOrder(order: Order) {
    this.itemArray.push(order);
  }

  public getProcessedOrders() {
    return this.processed;
  }

  public async processNextBatch(): Promise<void> {
    if (!this.process) {
      this.process = true;

      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() - 1);

      const batch = this.itemArray.splice(0, this.MaxItemsToProcess);

      // Make sure orders are processed in correct order. This is crucial
      // so that the items are delivered based on when the order has
      // been made (our stock may run out of items and we want those that ordered
      // first to receive the items).
      const promises = batch.map(async (order) => {
        if (!order.cancelled && order.date > expirationDate) {
          await this.processor.orderProcessor(order);

          const emails = order.recipients.split(";");
          emails.forEach(async (email) => {
            await this.processor.sendConfirmationMail(order, email);
          });
        }

        return order;
      });

      // Wait for all orders to be processed
      this.processed = this.processed.concat(await Promise.all(promises));

      // We're ready to process the next batch
      this.process = false;
    }
  }
}
