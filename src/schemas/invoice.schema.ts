import * as v from 'valibot';

export const invoiceSchema = v.object({
  authorizationNumber:v.string(),
  controlCode:v.string(),
  issueDate:v.date(),
  dueDate :v.date(),
  totalAmount:v.number(),
  issuerNIT:v.string(),
  buyerNIT:v.string(),
  buyerName:v.string(),
  studentId :v.number(),
  monthlyFeeId:v.number(),
});

export type TInvoiceInput = v.InferInput<typeof invoiceSchema>;

export const invoiceOuputSchema = v.object({
  id:v.number(),
  invoiceNumber: v.number(),
  authorizationNumber:v.string(),
  controlCode:v.string(),
  issueDate:v.date(),
  dueDate :v.date(),
  totalAmount:v.number(),
  issuerNIT:v.string(),
  buyerNIT:v.string(),
  buyerName:v.string(),
  studentId :v.number(),
  monthlyFeeId:v.number(),
});

export type TInvoiceOuput = v.InferInput<typeof invoiceOuputSchema>; 