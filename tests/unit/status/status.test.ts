import { checkStatus, StatusResponse } from '../../../src/status/status';
import {
  MessageType, Status, Target, TestStatusIds,
} from '../../../src/lib/enums';
import {
  errorValidation,
  errorAuth,
  errorNoResults,
  errorServer,
} from '../../../src/stubs/notify';
import { QueueRecord } from '../../../src/interfaces/queue';

jest.mock('../../../src/stubs/queue-records', () => ({
  getStatus: (): QueueRecord => ({
    id: 'valid-id',
    message_content: 'mock-content',
    message_type: 'email' as MessageType,
    target: 'gb' as Target,
    no_of_retries: 2,
    trace_id: 'valid-trace-id',
  }),
}));

describe('Notify stubbed status checker', () => {
  beforeEach(() => {
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('checker', () => {
    test('returns valid response', async () => {
      // arrange
      const id = 'valid-id';

      // act
      const actual = await checkStatus(id);

      // assert
      expect(actual).toStrictEqual({
        body: 'mock-content',
        id: 'valid-id',
        message_content: 'mock-content',
        message_type: MessageType.EMAIL,
        no_of_retries: 2,
        reference: 'valid-trace-id',
        status: 'delivered',
        subject: 'Subject',
        target: 'gb',
        template: {
          id: 456,
          uri: '/template/123/456',
          version: 123,
        },
        trace_id: 'valid-trace-id',
        type: 'email',
      });
    });

    test('returns technical failure', async () => {
      // arrange
      const id = TestStatusIds.TECHNICAL_FAILURE_ID;

      // act
      const actual = await checkStatus(id) as StatusResponse;

      // assert
      expect(actual.status).toEqual(Status.TECHNICAL_FAILURE);
    });

    test('returns temporary failure', async () => {
      // arrange
      const id = TestStatusIds.TEMPORARY_FAILURE_ID;

      // act
      const actual = await checkStatus(id) as StatusResponse;

      // assert
      expect(actual.status).toEqual(Status.TEMPORARY_FAILURE);
    });

    test('returns permanent failure', async () => {
      // arrange
      const id = TestStatusIds.PERMANENT_FAILURE_ID;

      // act
      const actual = await checkStatus(id) as StatusResponse;

      // assert
      expect(actual.status).toEqual(Status.PERMANENT_FAILURE);
    });

    test('returns 500 error', async () => {
      // arrange
      const id = TestStatusIds.STATUS_INTERNAL_SERVER_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorServer);
    });

    test('returns 400', async () => {
      // arrange
      const id = TestStatusIds.VALIDATION_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorValidation);
    });

    test('returns 403', async () => {
      // arrange
      const id = TestStatusIds.AUTH_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorAuth);
    });

    test('returns 404', async () => {
      // arrange
      const id = TestStatusIds.NO_RESULT_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorNoResults);
    });
  });
});
