import * as v from 'valibot';
enum MethodPayEnum {
  Cash = 'CASH',
  Bank = 'BANK',
  Qr = 'QR',
}
export const monthlyfeeSchema = v.object({
  inscriptionId  :    v.number(),
  startDate :   v.pipe(v.date(), v.toMinValue(new Date())),
  endDate:      v.date(),
  totalAmount:  v.number(),
  totalInscription: v.number(),
  studentId  :  v.number(),
  amountPaid  : v.number(),
  amountPending:  v.number(),
  state  :     v.boolean(),
});

export type TMonthlyfeeInput = v.InferInput<typeof monthlyfeeSchema>;

export const monthlyfeeAndMethodPaySchema = v.object({
  inscriptionId  :    v.number(),
  startDate :   v.pipe(v.date(), v.toMinValue(new Date())),
  endDate:      v.date(),
  totalAmount:  v.number(),
  totalInscription: v.number(),
  studentId  :  v.number(),
  amountPaid  : v.number(),
  amountPending:  v.number(),
  state  :     v.boolean(),
  commitmentDate  : v.pipe(v.date(), v.toMinValue(new Date())),
  transactionNumber: v.string(),
  isInscription:v.boolean(),
  payMethod:        v.enum_(MethodPayEnum)
});

export type TMonthlyfeeAndMethodPayInput = v.InferInput<typeof monthlyfeeAndMethodPaySchema>;  

export const GlobalMonthlyfeeSchema = v.object({
  id : v.number(),
  createdAt : v.date(),
  updatedAt : v.date(),
  inscriptionId  :    v.number(),
  startDate :   v.date(),
  endDate:      v.date(),
  totalAmount:  v.number(),
  totalInscription : v.number(),
  amountPending:  v.number(),
  studentId  :  v.number(),
  amountPaid  : v.number(),
  state  :     v.boolean(),
});

export type TMonthlyfeeOutput = v.InferInput<typeof GlobalMonthlyfeeSchema >;