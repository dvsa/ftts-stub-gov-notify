import { SenderResponseBody, getSenderRequest } from '../../../src/stubs/queue-records';
import processMessage from '../../../src/sender/sender';
import {
  errorServer, errorBadRequest, errorAuth, errorRateLimit, NotifyError,
} from '../../../src/stubs/notify';
import { TestEmails } from '../../../src/lib/enums';
import { SenderRequest } from '../../../src/interfaces/sender-request';

jest.mock('../../../src/stubs/queue-records', () => ({
  getRequestResponse: (): SenderResponseBody => ({
    content: {
      body: 'mock-body',
      from_email: 'mock-email',
      subject: 'mock-subject',
    },
    id: 'valid-id',
    reference: 'mock-reference',
    template: {
      id: 'mock-template-id',
      uri: 'mock-template-uri',
      version: 'mock-template-version',
    },
    uri: 'mock-uri',
    scheduled_for: 'mock-scheduled',
  }),
  getSenderRequest: (): SenderRequest => ({
    templateId: 'mock-template-id',
    email_address: 'mock-email',
    reference: 'mock-reference',
    personalisation: {
      subject: 'mock-personalisation-subject',
      content: 'mock-body',
    },
  }),
}));

describe('Sender', () => {
  let mockLog: jest.SpyInstance;
  let mockError: jest.SpyInstance;
  beforeEach(() => {
    mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    mockLog.mockReset();
    mockError.mockReset();
  });

  describe('email', () => {
    test('is successfully sent', async () => {
      // arrange
      const payload = getSenderRequest();

      // act
      const actual = await processMessage(payload) as SenderResponseBody;

      // assert
      expect(actual.content.body).toEqual(payload.personalisation.content);
      expect(actual.content.from_email).toEqual(payload.email_address);
      expect(actual.reference).toEqual(payload.reference);
    });

    test('returns 500', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TestEmails.SENDER_INTERNAL_SERVER_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toStrictEqual(new NotifyError(errorServer.status_code, errorServer.errors));
    });

    test('returns 400', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TestEmails.SENDER_BAD_REQUEST_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toStrictEqual(new NotifyError(errorBadRequest.status_code, errorBadRequest.errors));
    });

    test('returns 403', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TestEmails.SENDER_AUTH_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toStrictEqual(new NotifyError(errorAuth.status_code, errorAuth.errors));
    });

    test('returns 429', async () => {
      // arrange
      const payload = getSenderRequest();
      payload.email_address = TestEmails.SENDER_RATE_LIMIT_ERROR;

      // act and assert
      await expect(processMessage(payload))
        .rejects.toStrictEqual(new NotifyError(errorRateLimit.status_code, errorRateLimit.errors));
    });
  });
});
