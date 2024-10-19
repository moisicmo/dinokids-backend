import * as v from 'valibot';

enum MethodPayEnum {
  Cash = 'CASH',
  Bank = 'BANK',
  Qr = 'QR',
}

export const inscriptionPaymentSchema = v.object({
  inscriptionsId : v.number(),
  amount: v.number(),
  transactionNumber: v.string(),
  payMethod:        v.enum_(MethodPayEnum),
  buyerNIT: v.string(),
  buyerName:v.string(),

});

export type TInscriptionPaymentInput = v.InferInput<typeof inscriptionPaymentSchema>;