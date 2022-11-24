interface IndividualError {
  error: string;
  message: string;
}

export class NotifyError extends Error {
  public status_code: number;

  public errors: IndividualError[];

  constructor(status_code: number, errors: IndividualError[]) {
    super();

    this.status_code = status_code;
    this.errors = errors;
  }
}

export const errorBadRequest = {
  status_code: 400,
  errors: [{
    error: 'Bad request',
    message: 'STUB - Can\'t send to this recipient using a team-only API key',
  }],
};

export const errorAuth = {
  status_code: 403,
  errors: [{
    error: 'AuthError',
    message: 'STUB - Invalid token: API key not found',
  }],
};

export const errorRateLimit = {
  status_code: 429,
  errors: [{
    error: 'RateLimitError',
    message: 'STUB - Exceeded rate limit for key type TEAM/TEST/LIVE of 3000 requests per 60 seconds',
  }],
};

export const errorNoPostData = {
  status_code: 400,
  errors: [{
    error: 'NoPostError',
    message: 'STUB - No post data',
  }],
};

export const errorServer = {
  status_code: 500,
  errors: [{
    error: 'Exception',
    message: 'STUB - Internal server error',
  }],
};

export const errorValidation = {
  status_code: 400,
  errors: [{
    error: 'ValidationError',
    message: 'STUB - id is not a valid UUID',
  }],
};

export const errorNoResults = {
  status_code: 404,
  errors: [{
    error: 'NoResultFound',
    message: 'STUB - No result found',
  }],
};

export const errorUnknown = {
  status_code: 999,
  errors: [{
    error: 'Fake error',
    message: 'STUB - So fake',
  }],
};
