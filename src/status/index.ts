// eslint-disable-next-line import/no-unresolved
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import checkStatus from './status';

const httpTriggerStatus: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  if (context.res) {
    context.res.headers = { 'Content-Type': 'application/json' };
  }

  try {
    const body = await checkStatus(req.params.id);
    context.res = { ...context.res, body };
    context.done();
  } catch (e) {
    const status = e.status_code ? e.status_code : 500;
    const body = e;

    context.res = { ...context.res, body, status };

    context.done();
  }
};

export default httpTriggerStatus;
