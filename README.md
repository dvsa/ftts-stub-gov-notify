# Notification API Stub service

API wrapping GOV.UK Notify for testing purposes

**Sender** - Send emails and letters, and the stub service will respond like the real Gov notify service

>POST /v2/notifications/email
```
{
    "template_id": "templateIdTest",
    "email_address": "example@test.com",
    "personalisation": {
        "subject": "subjectTest",
        "content": "contentTest"
    },
    "reference": "refTest"
}
```


**Status** - Get the status of an email, the stub service will respond based on what "status id" trigger is used

>GET v2/notifications/{id}

### Test Email Triggers
```
  SENDER_INTERNAL_SERVER_ERROR = 'sender-500@kainos.com'
  STATUS_INTERNAL_SERVER_ERROR = 'status-500@kainos.com'
  SENDER_BAD_REQUEST_ERROR = 'sender-400@kainos.com'
  SENDER_AUTH_ERROR = 'sender-403@kainos.com'
  SENDER_RATE_LIMIT_ERROR = 'sender-429@kainos.com'
  TECHNICAL_FAILURE = 'status-technical-failure@kainos.com'
  TEMPORARY_FAILURE = 'status-temporary-failure@kainos.com'
  PERMANENT_FAILURE = 'status-permanent-failure@kainos.com'
```

### Test Status Id Triggers
```
  SENDER_INTERNAL_SERVER_ERROR_ID = '5adb5fba-6acc-11ea-bc55-0242ac130003',
  STATUS_INTERNAL_SERVER_ERROR_ID = 'dd794bb8-c802-47b7-a76c-c2aa98fc6a37',
  TECHNICAL_FAILURE_ID = 'ade65f00-0ff8-4da7-810b-c271cc6a0592',
  TEMPORARY_FAILURE_ID = 'e24c79dd-b4db-4e74-85fd-f327314f8a7d',
  PERMANENT_FAILURE_ID = '528d8991-385f-4925-88d2-399b97e965db',
  VALIDATION_ERROR_ID = 'd2933fd7-a0bf-4c5a-824a-01e70invalid',
  AUTH_ERROR_ID = '2d61aed6-70ca-4971-bedc-4b61f2dcauth',
  NO_RESULT_ERROR_ID = '4401b189-649e-44e4-90ce-a01anoresult'
```

## Build

Install node modules:
```
npm install
```

Compile the ts source:
```
npm run build
```

## Deploy

Deploy via VSCode with the Azure Functions extension

## Tests

All tests are housed in `.test.ts` files alongside the modules under test

Run all the tests:
```
npm run test
```

Watch the tests:
```
npm run test:watch
```

Run test coverage:
```
npm run test:coverage
```
See the generated `coverage` directory for the results

## Queues

### Request queue record structure
| Field name | mandatory/optional | Description | Example |
| ---------- | ------------------ | ----------- | ------- |
|message_content|y|Content of message (email/letter) to be delivered|"Dear Sir, Lorem ipsum. Regards DVSA"|
|message_type|y|email/letter/message|email/letter/sms|
|target|y|Is it for recipient from GB or NI|NI/GB|
| email | y for email | look below |  |
| letter | y for letter | look below |  |
|no_of_retries|y|default 0, incremented with each retry|0|
|reference|n|external system reference number - eg. booking reference number|1234567890|
|context_id|n|external system context_id for request tracking purpose|1234-5678-azq1-5tgb|

### Status queue record structure
| Field name | mandatory/optional | Description | Example |
| ---------- | ------------------ | ----------- | ------- |
|message_content|y|Content of message (email/letter) to be delivered|"Dear Sir, Lorem ipsum. Regards DVSA"|
|message_type|y|email/letter/message|email/letter/sms|
|target|y|Is it for recipient from GB or NI|NI/GB|
| email | y for email | look below |  |
| letter | y for letter | look below |  |
|no_of_retries|y|default 0, incremented with each retry|0|
|reference|n|external system reference number - eg. booking reference number|1234567890|
|context_id|n|external system context_id for request tracking purpose|1234-5678-azq1-5tgb|
|id|y|id for the notification as returned from gov.notify|1234-5678-azq1-5tgb|
|date|y|date/time that the notification was sent|Mon Mar 09 2020 13:54:11|
|status|y|status of the notification from querying gov.notify|sending|

email field will contain:
* message_subject
* email_address

letter field will contain
* name
* address_line_1
* address_line_2
* address_line_3
* address_line_4
* address_line_5
* address_line_6
* postcode
