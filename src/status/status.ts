import { Status, MessageType, TestStatusIds } from '../lib/enums';
import {
  getStatus,
} from '../stubs/queue-records';
import {
  errorServer,
  errorValidation,
  errorAuth,
  errorNoResults,
  NotifyError,
} from '../stubs/notify';
import { TestStatus, TestStatusData, testStatuses } from '../stubs/test-statuses';

export interface StatusResponse {
  id: string;
  body: string;
  subject: string;
  reference?: string;
  email_address?: string;
  phone_number?: string;
  line_1?: string;
  line_2?: string;
  line_3?: string;
  line_4?: string;
  line_5?: string;
  line_6?: string;
  postcode?: string;
  type: string;
  status?: Status;
  template: {
    version: number;
    id: number;
    uri: string;
  };
  created_by_name?: string;
  created_at?: string;
  sent_at?: string;
}

const mappedIdErrors = [
  { id: TestStatusIds.VALIDATION_ERROR_ID, errorResponse: errorValidation },
  { id: TestStatusIds.AUTH_ERROR_ID, errorResponse: errorAuth },
  { id: TestStatusIds.NO_RESULT_ERROR_ID, errorResponse: errorNoResults },
];

export const checkStatus = async (id: string): Promise<StatusResponse | NotifyError> => {
  console.log(`StubStatus received id: ${id}`);
  const testStatus: TestStatusData = testStatuses.find((s: TestStatus) => id === s.id);

  const [mappedError] = mappedIdErrors.filter((mappedIdError) => mappedIdError.id === id);
  if (mappedError) {
    console.log(`StubStatus throwing response: ${JSON.stringify(mappedError.errorResponse)}`);
    return Promise.reject(mappedError.errorResponse);
  }

  if (testStatus?.status === Status.INTERNAL_SERVER_ERROR) {
    console.log(`StubStatus throwing response: ${JSON.stringify(errorServer)}`);
    return Promise.reject(errorServer);
  }

  const body = getStatus();
  const status = testStatus?.status || Status.DELIVERED;
  const data: StatusResponse = {
    ...body,
    id,
    status,
    body: body.message_content,
    subject: 'Subject',
    type: MessageType.EMAIL,
    reference: body.trace_id,
    template: {
      version: 123,
      id: 456,
      uri: '/template/123/456',
    },
  };

  console.log(`StubStatus responding response: ${JSON.stringify(data)}`);
  return Promise.resolve(data);
};

export default checkStatus;
