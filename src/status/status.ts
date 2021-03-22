// eslint-disable-next-line import/no-unresolved

import { STATUS, MESSAGE_TYPE, TEST_STATUS_IDS } from '../lib/enums';
import {
  getStatus, testStatuses, TestStatus, TestStatusData,
} from '../stubs/queue-records';
import {
  errorServer,
  NotifyError,
  errorValidation,
  errorAuth,
  errorNoResults,
} from '../stubs/notify';

interface StatusResponse {
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
  status?: STATUS;
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
  { id: TEST_STATUS_IDS.VALIDATION_ERROR_ID, errorResponse: errorValidation },
  { id: TEST_STATUS_IDS.AUTH_ERROR_ID, errorResponse: errorAuth },
  { id: TEST_STATUS_IDS.NO_RESULT_ERROR_ID, errorResponse: errorNoResults },
];

const checkStatus = async (id: string): Promise<StatusResponse | NotifyError> => {
  console.log(`StubStatus received id: ${id}`);
  const testStatus: TestStatusData = testStatuses.find((s: TestStatus) => id === s.id);

  const [mappedError] = mappedIdErrors.filter((mappedIdError) => mappedIdError.id === id);
  if (mappedError) {
    console.log(`StubStatus throwing response: ${JSON.stringify(mappedError.errorResponse)}`);
    return Promise.reject(mappedError.errorResponse);
  }

  if (testStatus?.status === STATUS.INTERNAL_SERVER_ERROR) {
    console.log(`StubStatus throwing response: ${JSON.stringify(errorServer)}`);
    return Promise.reject(errorServer);
  }

  const body = getStatus();
  const status = testStatus?.status || STATUS.DELIVERED;
  const data = {
    ...body,
    id,
    status,
    body: body.message_content,
    subject: 'Subject',
    type: MESSAGE_TYPE.EMAIL,
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
