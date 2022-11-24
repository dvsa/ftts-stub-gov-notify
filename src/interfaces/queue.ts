import { MessageType, Target, Status } from '../lib/enums';

export interface QueueRecord {
  id: string;
  date?: Date;
  status?: Status;
  message_content: string;
  message_type: MessageType;
  target: Target;
  email?: {
    message_subject: string;
    email_address: string;
  };
  letter?: {
    name: string;
    address_line_1: string;
    address_line_2: string;
    address_line_3?: string;
    address_line_4?: string;
    address_line_5?: string;
    address_line_6?: string;
    postcode: string;
  };
  no_of_retries: number;
  reference?: string;
  context_id?: string;
  trace_id: string;
}
