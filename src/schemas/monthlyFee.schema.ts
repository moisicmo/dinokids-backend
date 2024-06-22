import * as v from 'valibot';

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