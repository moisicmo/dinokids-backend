import { Response, Request } from 'express';
import { CustomError, PaginationDto, StaffDto } from '../../domain';
import {createMonthlyFee, getOneMonthlyFee, updateMonthlyFee, deleteMonthlyFee, getPricesByIdClasses, getOnePrice, getMonthlyFee, createMonthlyFeePayment}  from '../services';
import { TMonthlyfeeAndMethodPayInput, TMonthlyfeeInput, TMonthlyfeeOutput } from '../../schemas/monthlyFee.schema';
import { StudentService, InscriptionService } from '../services';
import { TPriceOutput } from '../../schemas/price';
import { TInscriptionPaymentInput } from '../../schemas/inscription.schema';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  console.log(`${error}`);
  return res.status(500).json({ error: 'Internal server error' });
};

// create inscription
export async function createInscriptionFeeCtrl(
	req: Request<{}, {}, TInscriptionPaymentInput>,
	res: Response
) {
  const body = req.body;
  console.log("body inscripcion:", body)
  let insciptionService = new InscriptionService();
	try {
     //find inscription by Id
      let data = await insciptionService.getInscriptionsById(body.inscriptionsId) as any;
      // control inscription id
      if (!data) throw CustomError.badRequest('El id de la inscripción no existe');
      const dataPrice:TPriceOutput = data.price;
      if (!dataPrice) throw CustomError.badRequest('El id del precio no existe');
      //control pay month
      let totalAmount = dataPrice.month;
      let amountPending = dataPrice.month-0;
      if (body.amount !== dataPrice.inscription) throw CustomError.badRequest(`revise el pago realizado de la inscripción, la institucion no puede salir deviendo o no pude salir perdiendo, total inscripcion a pagar:${dataPrice.inscription}`);
      let state = amountPending <= 0 ? true : false;
      let startDate= new Date();
      let endDate= new Date();
      let studentId = data.student.id;

		const MonthlyFee = await createMonthlyFee({ 
      inscriptionId: body.inscriptionsId,// TOMAR EN CUENTA inscriptions terminacion con s
      totalInscription: body.amount,
      startDate,
      endDate,
      totalAmount,
      amountPending,
      studentId,
      amountPaid:0,
      state
    }) as any;


    const MonthlyFeePayment = await createMonthlyFeePayment({
      ...body, 
      paymentDate: new Date(), 
      commitmentDate: new Date(), 
      isInscription: true, 
      monthlyFeeId: MonthlyFee.id
    })

		 return res.status(201).json({MonthlyFee, MonthlyFeePayment})
	} catch (error) {
    handleError(error, res)
	}
}
////////////////

export async function createMonthlyFeeCtrl(
	req: Request<{}, {}, TMonthlyfeeAndMethodPayInput>,
	res: Response
) {
  const body = req.body;
  console.log(req.body);

  let studentService = new StudentService();
  let insciptionService = new InscriptionService();
	try {
     //find inscription by Id
      let data = await insciptionService.getInscriptionsById(body.inscriptionId) as any;
      // control inscription id
      if (!data) throw CustomError.badRequest('El id de la inscripción no existe');
      const dataPrice:TPriceOutput = data.price;
      if (!dataPrice) throw CustomError.badRequest('El id del precio no existe');
      //control pay month
      let totalAmount = dataPrice.month;
      let amountPending = dataPrice.month - body.amountPaid;
      if (amountPending < 0 ) throw CustomError.badRequest(`revise el pago realizado, la institucion no puede salir deviendo, total a pargar de la clase:${dataPrice.month}`);
      let state = amountPending <= 0 ? true : false;
      
     

		const MonthlyFee = await createMonthlyFee({...body, totalAmount, amountPending, state}) as any;

    const MonthlyFeePayment = await createMonthlyFeePayment({
      amount: body.amountPaid,
      commitmentDate: body.commitmentDate,
      paymentDate: new Date(), 
      isInscription: body.isInscription, 
      monthlyFeeId: MonthlyFee.id,
      payMethod: body.payMethod,
      transactionNumber: body.transactionNumber
    })

		 return res.status(201).json({MonthlyFee, MonthlyFeePayment})
	} catch (error) {
    handleError(error, res)
	}
}

 export const findMonthlyFeesCtrl = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const [error, paginationDto] = PaginationDto.create(+page, +limit);
  if (error) return res.status(400).json({ error });

  try {
    const  MonthlyFees = await getMonthlyFee(paginationDto!)
    return res.status(201).json(MonthlyFees)
  } catch (error) {
    handleError(error, res)
  }
} 

export const findOneMonthlyFeeCtrl = async (req: Request, res: Response) => {

  const id = req.params.id
  console.log(id)
  try {
    const  MonthlyFee = await getOneMonthlyFee(parseInt(id))
    return res.status(201).json(MonthlyFee)
  } catch (error) {
    handleError(error, res)
  }
}

export const updateMonthlyFeeCtrl = async (
  req: Request<{id:string}, {}, TMonthlyfeeAndMethodPayInput>,
	res: Response) => {

  const body = req.body;
  const id = req.params.id
  console.log(id)
  try {
      // find monthly fee
      const  data = await getOneMonthlyFee(parseInt(id)) as any;
      const dataMonthlyFee:TMonthlyfeeOutput = data.monthlyFee;
     if (!dataMonthlyFee) throw CustomError.badRequest('El id de la cuota mensual a modificar no existe');
     // control pay state

     if(dataMonthlyFee.state === true){
      return res.status(201).json({message: 'No hay deuda en el pago de esta mensualidad'})
     }
     if(dataMonthlyFee.totalAmount === 0){

     }
      //control pay month
      let amountPaid = await dataMonthlyFee.amountPaid + body.amountPaid;
      console.log('amountPaid:', amountPaid);
      let amountPending = await dataMonthlyFee.totalAmount - amountPaid;
      console.log('amountPending:', amountPending);

      if (amountPending < 0 ) throw CustomError.badRequest(`revise el pago realizado, la institucion no puede salir deviendo, pago pendiente la clase:${dataMonthlyFee.amountPending}`);

      body.amountPaid = amountPaid;
      body.amountPending = amountPending;
      body.state = amountPending <= 0 ? true : false;

    const  MonthlyFee = await updateMonthlyFee(parseInt(id),{...body} )

    const MonthlyFeePayment = await createMonthlyFeePayment({
      amount: body.amountPaid,
      commitmentDate: body.commitmentDate,
      paymentDate: new Date(), 
      isInscription: body.isInscription, 
      monthlyFeeId: parseInt(id),
      payMethod: body.payMethod,
      transactionNumber: body.transactionNumber
    })

		 return res.status(201).json({MonthlyFee, MonthlyFeePayment})
  } catch (error) {
    handleError(error, res)
  }
}

export const deleteMonthlyFeeCtrl = async (
  req: Request<{id:string}, {}, TMonthlyfeeInput>,
	res: Response) => {

  const body = req.body;
  const id = req.params.id
  console.log(id)
  try {
    const  price = await deleteMonthlyFee(parseInt(id) )
    return res.status(201).json(price)
  } catch (error) {
    handleError(error, res)
  }
}

/* export const findPricesByClassesIdCtrl = async (req: Request, res: Response) => {
  const id = req.params.id
  console.log(id)
  const { page = 1, limit = 10 } = req.query;
  const [error, paginationDto] = PaginationDto.create(+page, +limit);
  if (error) return res.status(400).json({ error });

  try {
    const  prices = await getPricesByIdClasses(parseInt(id),paginationDto!)
    return res.status(201).json(prices)
  } catch (error) {
    handleError(error, res)
  }
} */