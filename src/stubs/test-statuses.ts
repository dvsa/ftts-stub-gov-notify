import { TestEmails, TestStatusIds, Status } from '../lib/enums';

export const testStatuses: TestStatus[] = [
  {
    email: TestEmails.SENDER_INTERNAL_SERVER_ERROR,
    id: TestStatusIds.SENDER_INTERNAL_SERVER_ERROR_ID,
    status: Status.INTERNAL_SERVER_ERROR,
  },
  {
    email: TestEmails.STATUS_INTERNAL_SERVER_ERROR,
    id: TestStatusIds.STATUS_INTERNAL_SERVER_ERROR_ID,
    status: Status.INTERNAL_SERVER_ERROR,
  },
  {
    email: TestEmails.TECHNICAL_FAILURE,
    id: TestStatusIds.TECHNICAL_FAILURE_ID,
    status: Status.TECHNICAL_FAILURE,
  },
  {
    email: TestEmails.TEMPORARY_FAILURE,
    id: TestStatusIds.TEMPORARY_FAILURE_ID,
    status: Status.TEMPORARY_FAILURE,
  },
  {
    email: TestEmails.PERMANENT_FAILURE,
    id: TestStatusIds.PERMANENT_FAILURE_ID,
    status: Status.PERMANENT_FAILURE,
  },
];

export type TestStatus = {
  email: string;
  id: string;
  status: Status;
};

export type TestStatusData = TestStatus | undefined;
