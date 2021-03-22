/* eslint-disable @typescript-eslint/camelcase, import/no-extraneous-dependencies */
import fakerGB from 'faker/locale/en_GB';

import {
  MESSAGE_TYPE, TARGET, STATUS, TEST_EMAILS, TEST_STATUS_IDS,
} from '../lib/enums';
import { QueueRecord } from '../interfaces/queue';

interface SenderResponseBody {
  content: {
    body: string;
    from_email: string;
    subject: string;
  };
  id: string;
  reference: string | null;
  template: {
    id: string;
    uri: string;
    version: string;
  };
  uri: string;
  scheduled_for?: string | null;
}

export type TestStatus = {
  email: string;
  id: string;
  status: STATUS;
};

export type TestStatusData = TestStatus | undefined;

export const testStatuses: TestStatus[] = [
  {
    email: TEST_EMAILS.SENDER_INTERNAL_SERVER_ERROR,
    id: TEST_STATUS_IDS.SENDER_INTERNAL_SERVER_ERROR_ID,
    status: STATUS.INTERNAL_SERVER_ERROR,
  },
  {
    email: TEST_EMAILS.STATUS_INTERNAL_SERVER_ERROR,
    id: TEST_STATUS_IDS.STATUS_INTERNAL_SERVER_ERROR_ID,
    status: STATUS.INTERNAL_SERVER_ERROR,
  },
  {
    email: TEST_EMAILS.TECHNICAL_FAILURE,
    id: TEST_STATUS_IDS.TECHNICAL_FAILURE_ID,
    status: STATUS.TECHNICAL_FAILURE,
  },
  {
    email: TEST_EMAILS.TEMPORARY_FAILURE,
    id: TEST_STATUS_IDS.TEMPORARY_FAILURE_ID,
    status: STATUS.TEMPORARY_FAILURE,
  },
  {
    email: TEST_EMAILS.PERMANENT_FAILURE,
    id: TEST_STATUS_IDS.PERMANENT_FAILURE_ID,
    status: STATUS.PERMANENT_FAILURE,
  },
];

export function getRequest(): QueueRecord {
  const address_line_1 = fakerGB.address.streetAddress();
  const address_line_2 = fakerGB.address.secondaryAddress();
  const postcode = fakerGB.address.zipCode();
  const context_id = fakerGB.random.uuid();
  const message_content = fakerGB.lorem.paragraphs();
  const message_subject = fakerGB.company.catchPhrase();
  const message_type = MESSAGE_TYPE.EMAIL;
  const email_address = fakerGB.internet.email();
  const name = fakerGB.name.findName();
  const reference = fakerGB.random.uuid();
  const target = fakerGB.random.arrayElement([TARGET.GB, TARGET.NI]);
  const no_of_retries = 0;
  const trace_id = fakerGB.random.uuid();
  const id = fakerGB.random.word();

  const email = {
    message_subject,
    email_address,
  };
  const letter = {
    name,
    address_line_1,
    address_line_2,
    postcode,
    trace_id,
  };
  const obj = { email, letter };
  return {
    id,
    message_content,
    message_type,
    target,
    // eslint-disable-next-line security/detect-object-injection
    [message_type]: obj[message_type],
    no_of_retries,
    reference,
    context_id,
    trace_id,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSenderRequest(): any {
  const template_id = fakerGB.random.uuid();
  const reference = fakerGB.random.uuid();
  const email_address = fakerGB.internet.email();
  const message_content = fakerGB.lorem.paragraphs();
  const message_subject = fakerGB.company.catchPhrase();

  return {
    template_id,
    email_address,
    reference,
    personalisation: {
      subject: message_subject,
      content: message_content,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getRequestResponse(body: any): SenderResponseBody {
  const fakeRequest = getRequest();
  const requestEmail: string | undefined = body.email_address;
  const testStatus: TestStatusData = testStatuses.find(({ email }) => email === requestEmail);
  const requestId = requestEmail ? (testStatus?.id || fakeRequest.reference) : fakeRequest.reference;
  const response = {
    id: requestId || fakerGB.random.uuid(),
    reference: body.reference || '',
    content: {
      body: body.personalisation.content || '',
      from_email: requestEmail || '',
      subject: body.personalisation.message_subject || '',
    },
    uri: `https://api.notifications.service.gov.uk/v2/notifications/${fakeRequest.reference}`,
    template: {
      id: fakeRequest.context_id || '',
      version: '1',
      uri: `https://api.notificaitons.service.gov.uk/service/your_service_id/templates/${fakeRequest.reference}`,
    },
  };
  return response;
}

export function getStatus(): QueueRecord {
  const record = getRequest();
  const date = new Date();
  const status = fakerGB.random.arrayElement([
    STATUS.CREATED,
    STATUS.DELIVERED,
    STATUS.PERMANENT_FAILURE,
    STATUS.SENDING,
    STATUS.TECHNICAL_FAILURE,
    STATUS.TEMPORARY_FAILURE,
  ]);
  const trace_id = fakerGB.random.uuid();

  return {
    ...record,
    date,
    status,
    trace_id,
  };
}
