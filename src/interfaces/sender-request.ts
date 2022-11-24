export interface SenderRequest {
  templateId: string,
  email_address: string,
  reference: string,
  personalisation: {
    subject: string,
    content: string,
  },
}
