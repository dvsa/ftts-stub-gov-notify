import fakerGB from 'faker/locale/en_GB';

import {
  MessageType, Target, Status,
} from '../lib/enums';
import { QueueRecord } from '../interfaces/queue';
import { SenderRequest } from '../interfaces/sender-request';
import { TestStatusData, testStatuses } from './test-statuses';

export interface SenderResponseBody {
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

export function getRequest(): QueueRecord {
  const addressLine1 = fakerGB.address.streetAddress();
  const addressLine2 = fakerGB.address.secondaryAddress();
  const postcode = fakerGB.address.zipCode();
  const contextId = fakerGB.random.uuid();
  const messageContent = fakerGB.lorem.paragraphs();
  const messageSubject = fakerGB.company.catchPhrase();
  const messageType = MessageType.EMAIL;
  const emailAddress = fakerGB.internet.email();
  const name = fakerGB.name.findName();
  const reference = fakerGB.random.uuid();
  const target = fakerGB.random.arrayElement([Target.GB, Target.NI]);
  const noOfRetries = 0;
  const traceId = fakerGB.random.uuid();
  const id = fakerGB.random.word();

  const email = {
    message_subject: messageSubject,
    email_address: emailAddress,
  };
  const letter = {
    name,
    address_line_1: addressLine1,
    address_line_2: addressLine2,
    postcode,
    trace_id: traceId,
  };
  const obj = { email, letter };
  return {
    id,
    message_content: messageContent,
    message_type: messageType,
    target,
    // eslint-disable-next-line security/detect-object-injection
    [messageType]: obj[messageType],
    no_of_retries: noOfRetries,
    reference,
    context_id: contextId,
    trace_id: traceId,
  };
}

export function getSenderRequest(): SenderRequest {
  const templateId = fakerGB.random.uuid();
  const reference = fakerGB.random.uuid();
  const emailAddress = fakerGB.internet.email();
  const messageContent = fakerGB.lorem.paragraphs();
  const messageSubject = fakerGB.company.catchPhrase();

  return {
    templateId,
    email_address: emailAddress,
    reference,
    personalisation: {
      subject: messageSubject,
      content: messageContent,
    },
  };
}

export function getRequestResponse(body: SenderRequest): SenderResponseBody {
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
      subject: body.personalisation.subject || '',
    },
    uri: `https://api.notifications.service.gov.uk/v2/notifications/${fakeRequest.reference as string}`,
    template: {
      id: fakeRequest.context_id || '',
      version: '1',
      uri: `https://api.notificaitons.service.gov.uk/service/your_service_id/templates/${fakeRequest.reference as string}`,
    },
  };
  return response;
}

export function getStatus(): QueueRecord {
  const record = getRequest();
  const date = new Date();
  const status = fakerGB.random.arrayElement([
    Status.CREATED,
    Status.DELIVERED,
    Status.PERMANENT_FAILURE,
    Status.SENDING,
    Status.TECHNICAL_FAILURE,
    Status.TEMPORARY_FAILURE,
  ]);
  const traceId = fakerGB.random.uuid();

  return {
    ...record,
    date,
    status,
    trace_id: traceId,
  };
}
