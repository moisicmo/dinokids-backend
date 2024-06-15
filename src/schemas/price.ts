import * as v from 'valibot';

export const priceSchema = v.object({
  classesId : v.number(),
  inscription : v.number(),
  month : v.number(),
  state : v.boolean(),
});

export type TPriceInput = v.InferInput<typeof priceSchema>; 

export const globalPriceSchema = v.object({
  id : v.number(),
  createdAt : v.date(),
  updatedAt : v.date(),
  classesId : v.number(),
  inscription : v.number(),
  month : v.number(),
  state : v.boolean(),
});

export type TPriceOutput = v.InferInput<typeof priceSchema >;