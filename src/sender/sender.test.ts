import { getSenderRequest } from '../stubs/queue-records';
import processMessage from './sender';
import {
  errorServer, errorBadRequest, errorAuth, errorRateLimit,
} from '../stubs/notify';
import { TEST_EMAILS } from '../lib/enums';

describe('Sender', () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('email', () => {
    test('is successfully sent', async () => {
      // arrange
      const payload = getSenderRequest();

      // act
      const actual = await processMessage(payload);

      // assert
      expect(actual.content.body).toEqual(payload.personalisation.content);
      expect(actual.content.from_email).toEqual(payload.email_address);
      expect(actual.reference).toEqual(payload.reference);
    });

    test('returns 500', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TEST_EMAILS.SENDER_INTERNAL_SERVER_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toBe(errorServer);
    });

    test('returns 400', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TEST_EMAILS.SENDER_BAD_REQUEST_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toBe(errorBadRequest);
    });

    test('returns 403', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TEST_EMAILS.SENDER_AUTH_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toBe(errorAuth);
    });

    test('returns 429', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TEST_EMAILS.SENDER_RATE_LIMIT_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toBe(errorRateLimit);
    });
  });
});
