import {
  getRequestResponse,
} from '../stubs/queue-records';
import {
  errorServer, NotifyError, errorBadRequest, errorAuth, errorRateLimit,
} from '../stubs/notify';
import { TEST_EMAILS } from '../lib/enums';

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
  { email: TEST_EMAILS.SENDER_INTERNAL_SERVER_ERROR, errorResponse: errorServer },
  { email: TEST_EMAILS.SENDER_BAD_REQUEST_ERROR, errorResponse: errorBadRequest },
  { email: TEST_EMAILS.SENDER_AUTH_ERROR, errorResponse: errorAuth },
  { email: TEST_EMAILS.SENDER_RATE_LIMIT_ERROR, errorResponse: errorRateLimit },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processMessage = async (body: any): Promise<SenderResponseBody | NotifyError> => {
  console.log(`StubSender received: ${JSON.stringify(body)}`);
  const mappedErrors = mappedEmailErrors.filter((mappedEmailError) => mappedEmailError.email === body.email_address);

  if (mappedErrors[0]) {
    const response = mappedErrors[0].errorResponse;
    console.log(`StubSender throwing response: ${JSON.stringify(response)}`);
    return Promise.reject(response);
  }

  const queueRecord: SenderResponseBody = getRequestResponse(body);
  console.log(`StubSender resolving response: ${JSON.stringify(queueRecord)}`);
  return Promise.resolve(queueRecord);
};

export default processMessage;
