import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { NotifyError } from '../stubs/notify';

import { checkStatus } from './status';

const httpTriggerStatus: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  if (context.res) {
    context.res.headers = { 'Content-Type': 'application/json' };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const body = await checkStatus(req.params.id as string);
    context.res = { ...context.res, body };
    return context.done();
  } catch (e) {
    if (e instanceof NotifyError) {
      const status = e.status_code ? e.status_code : 500;
      const body = e;

      context.res = { ...context.res, body, status };

      return context.done();
    }
    return context.done(e as Error);
  }
};

export default httpTriggerStatus;
