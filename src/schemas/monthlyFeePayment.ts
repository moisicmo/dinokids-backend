import * as v from 'valibot';

enum MethodPayEnum {
  Cash = 'CASH',
  Bank = 'BANK',
  Qr = 'QR',
}

export const monthlyFeePaymentSchema = v.object({
  paymentDate : v.pipe(v.date(), v.toMinValue(new Date())),
  amount: v.number(),
  monthlyFeeId: v.number(),
  commitmentDate  : v.pipe(v.date(), v.toMinValue(new Date())),
  transactionNumber: v.string(),
  isInscription:v.boolean(),
  payMethod:        v.enum_(MethodPayEnum)
});

export type TMonthlyFeePaymentInput = v.InferInput<typeof monthlyFeePaymentSchema>; 

export const GlobalMonthlyFeePaymentSchema = v.object({
  id : v.number(),
  createdAt : v.date(),
  updatedAt : v.date(),
  paymentDate : v.pipe(v.date(), v.toMinValue(new Date())),
  amount: v.number(),
  monthlyFeeId: v.number(),
  commitmentDate  : v.pipe(v.date(), v.toMinValue(new Date())),
  transactionNumber: v.string(),
  payMethod:        v.enum_(MethodPayEnum),
});

export type TMonthlyFeePaymentOutput = v.InferInput<typeof GlobalMonthlyFeePaymentSchema >;