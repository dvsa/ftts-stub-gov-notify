export enum Status {
  ACCEPTED = 'accepted',
  CREATED = 'created',
  DELIVERED = 'delivered',
  INTERNAL_SERVER_ERROR = 'internal-server-error',
  TECHNICAL_FAILURE = 'technical-failure',
  TEMPORARY_FAILURE = 'temporary-failure',
  PERMANENT_FAILURE = 'permanent-failure',
  RECEIVED = 'received',
  SENDING = 'sending',
}

export enum MessageType {
  EMAIL = 'email',
  LETTER = 'letter',
}

export enum Target {
  GB = 'gb',
  NI = 'ni',
}

export enum TestEmails {
  SENDER_INTERNAL_SERVER_ERROR = 'sender-500@kainos.com',
  STATUS_INTERNAL_SERVER_ERROR = 'status-500@kainos.com',
  SENDER_BAD_REQUEST_ERROR = 'sender-400@kainos.com',
  SENDER_AUTH_ERROR = 'sender-403@kainos.com',
  SENDER_RATE_LIMIT_ERROR = 'sender-429@kainos.com',
  TECHNICAL_FAILURE = 'status-technical-failure@kainos.com',
  TEMPORARY_FAILURE = 'status-temporary-failure@kainos.com',
  PERMANENT_FAILURE = 'status-permanent-failure@kainos.com',
}

export enum TestStatusIds {
  SENDER_INTERNAL_SERVER_ERROR_ID = '5adb5fba-6acc-11ea-bc55-0242ac130003',
  STATUS_INTERNAL_SERVER_ERROR_ID = 'dd794bb8-c802-47b7-a76c-c2aa98fc6a37',
  TECHNICAL_FAILURE_ID = 'ade65f00-0ff8-4da7-810b-c271cc6a0592',
  TEMPORARY_FAILURE_ID = 'e24c79dd-b4db-4e74-85fd-f327314f8a7d',
  PERMANENT_FAILURE_ID = '528d8991-385f-4925-88d2-399b97e965db',
  VALIDATION_ERROR_ID = 'd2933fd7-a0bf-4c5a-824a-01e70invalid',
  AUTH_ERROR_ID = '2d61aed6-70ca-4971-bedc-4b61f2dcauth',
  NO_RESULT_ERROR_ID = '4401b189-649e-44e4-90ce-a01anoresult',
}
