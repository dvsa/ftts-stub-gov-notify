import checkStatus from './status';
import { STATUS, TEST_STATUS_IDS } from '../lib/enums';
import {
  errorValidation,
  errorAuth,
  errorNoResults,
  errorServer,
} from '../stubs/notify';

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
      expect(actual.id).toBe(id);
      expect(actual.status).toEqual(STATUS.DELIVERED);
    });

    test('returns technical failure', async () => {
      // arrange
      const id = TEST_STATUS_IDS.TECHNICAL_FAILURE_ID;

      // act
      const actual = await checkStatus(id);

      // assert
      expect(actual.status).toEqual(STATUS.TECHNICAL_FAILURE);
    });

    test('returns temporary failure', async () => {
      // arrange
      const id = TEST_STATUS_IDS.TEMPORARY_FAILURE_ID;

      // act
      const actual = await checkStatus(id);

      // assert
      expect(actual.status).toEqual(STATUS.TEMPORARY_FAILURE);
    });

    test('returns permanent failure', async () => {
      // arrange
      const id = TEST_STATUS_IDS.PERMANENT_FAILURE_ID;

      // act
      const actual = await checkStatus(id);

      // assert
      expect(actual.status).toEqual(STATUS.PERMANENT_FAILURE);
    });

    test('returns 500 error', async () => {
      // arrange
      const id = TEST_STATUS_IDS.STATUS_INTERNAL_SERVER_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorServer);
    });

    test('returns 400', async () => {
      // arrange
      const id = TEST_STATUS_IDS.VALIDATION_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorValidation);
    });

    test('returns 403', async () => {
      // arrange
      const id = TEST_STATUS_IDS.AUTH_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorAuth);
    });

    test('returns 404', async () => {
      // arrange
      const id = TEST_STATUS_IDS.NO_RESULT_ERROR_ID;

      // act and assert
      await expect(checkStatus(id))
        .rejects.toBe(errorNoResults);
    });
  });
});
