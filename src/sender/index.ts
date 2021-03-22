// eslint-disable-next-line import/no-unresolved
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

import processMessage from './sender';
import { errorNoPostData } from '../stubs/notify';

const httpTriggerSender: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  if (context.res) {
    context.res.headers = { 'Content-Type': 'application/json' };

    if (!req.body) {
      context.res = { ...context.res, status: errorNoPostData.status_code, body: errorNoPostData };
      return context.done();
    }
  }

  try {
    const body = await processMessage(req.body);
    context.res = { ...context.res, body };
    return context.done();
  } catch (e) {
    const status = e.status_code ? e.status_code : 500;
    const body = e;

    context.res = { ...context.res, body, status };

    return context.done();
  }
};

export default httpTriggerSender;
