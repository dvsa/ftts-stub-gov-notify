import {
  getRequestResponse,
} from '../stubs/queue-records';
import {
  errorServer, errorBadRequest, errorAuth, errorRateLimit, NotifyError,
} from '../stubs/notify';
import { TestEmails } from '../lib/enums';
import { SenderRequest } from '../interfaces/sender-request';

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

const mappedEmailErrors = [
  { email: TestEmails.SENDER_INTERNAL_SERVER_ERROR, errorResponse: errorServer },
  { email: TestEmails.SENDER_BAD_REQUEST_ERROR, errorResponse: errorBadRequest },
  { email: TestEmails.SENDER_AUTH_ERROR, errorResponse: errorAuth },
  { email: TestEmails.SENDER_RATE_LIMIT_ERROR, errorResponse: errorRateLimit },
];

const processMessage = async (body: SenderRequest): Promise<SenderResponseBody | NotifyError> => {
  console.log(`StubSender received: ${JSON.stringify(body)}`);
  const mappedErrors = mappedEmailErrors.filter((mappedEmailError) => mappedEmailError.email === body.email_address);

  if (mappedErrors[0]) {
    const response = mappedErrors[0].errorResponse;
    console.log(`StubSender throwing response: ${JSON.stringify(response)}`);
    const error = new NotifyError(response.status_code, response.errors);
    return Promise.reject(error);
  }

  const queueRecord: SenderResponseBody = getRequestResponse(body);
  console.log(`StubSender resolving response: ${JSON.stringify(queueRecord)}`);
  return Promise.resolve(queueRecord);
};

export default processMessage;
