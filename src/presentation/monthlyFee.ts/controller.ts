import { Response, Request } from 'express';
import { CustomError, PaginationDto, StaffDto,CustomSuccessful } from '../../domain';
import {createMonthlyFee, getOneMonthlyFee, getOneMonthlyFeeByIdInscriptions,updateMonthlyFee, deleteMonthlyFee, getPricesByIdClasses, getOnePrice, getMonthlyFee, createMonthlyFeePayment, createInvoice}  from '../services';
import { TMonthlyfeeAndMethodPayInput, TMonthlyfeeInput, TMonthlyfeeOutput } from '../../schemas/monthlyFee.schema';
import { StudentService, InscriptionService } from '../services';
import { TPriceOutput } from '../../schemas/price';
import { TInscriptionPaymentInput } from '../../schemas/inscription.schema';
import { generatePdf } from '../../config';
import { generatePayInscriptionPdf } from '../../config/documents/pdf/monthleFee.pdf';

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
  console.log("body inscripcion :", body)
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
    
console.log("createMonthlyFee:", MonthlyFee);
    const MonthlyFeePayment = await createMonthlyFeePayment({
      ...body,
      paymentDate: new Date(), 
      commitmentDate: new Date(), 
      isInscription: true, 
      monthlyFeeId: MonthlyFee.id
    })


    const invoice = await createInvoice({
      invoiceNumber:"12345",
      authorizationNumber:"12345",
      controlCode:"12345",
      issueDate:new Date(),
      dueDate :new Date(),
      totalAmount,
      issuerNIT:"12345",
      buyerNIT:body.buyerNIT,
      buyerName:body.buyerName,
      studentId,
      monthlyFeeId:MonthlyFee.id,
    })
    console.log("invoice:", invoice);
    //const document = await generatePayInscriptionPdf(MonthlyFee);
    //const dataSend =  CustomSuccessful.response({result: {...MonthlyFee} });
    return res.status(201).json({...MonthlyFee, invoices: [invoice], payments:[MonthlyFeePayment]})
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
	try {
     //find inscription by Id
      let data = await getOneMonthlyFeeByIdInscriptions(body.inscriptionId);

      // control inscription id
      if (data) {
        // control pay state

     if(data.state === true){
      return res.status(201).json({message: 'No hay deuda en el pago de esta mensualidad'})
     }
     
      //control pay month
      let amountPaid = await data.amountPaid + body.amountPaid;
      console.log('amountPaid:', amountPaid);
      let amountPending = await data.totalAmount - amountPaid;
      console.log('amountPending:', amountPending);

      if (amountPending < 0 ) throw CustomError.badRequest(`revise el pago realizado, la institucion no puede salir deviendo, pago pendiente la clase:${data.amountPending}`);

      body.amountPaid = amountPaid;
      body.amountPending = amountPending;
      body.state = amountPending <= 0 ? true : false;

    const  MonthlyFee = await updateMonthlyFee(data.id,{...body} )

    const MonthlyFeePayment = await createMonthlyFeePayment({
      amount: body.amountPaid,
      commitmentDate:new Date(body.commitmentDate),
      paymentDate: new Date(), 
      isInscription: body.isInscription, 
      monthlyFeeId: data.id,
      payMethod: body.payMethod,
      transactionNumber: body.transactionNumber
    })

    const invoice = await createInvoice({
      invoiceNumber:"12345",
      authorizationNumber:"12345",
      controlCode:"12345",
      issueDate:new Date(),
      dueDate :new Date(),
      totalAmount: body.amountPaid,
      issuerNIT:"12345",
      buyerNIT:body.buyerNIT,
      buyerName:body.buyerName,
      studentId: data.studentId,
      monthlyFeeId:data.id,
    })
    console.log("invoice:", invoice);

    const dataSend =  CustomSuccessful.response({result: {...MonthlyFee,invoices: [invoice], payments:[MonthlyFeePayment], message:'update'} });
    return res.status(201).json(dataSend)
       
      }else{
        const body = req.body;
  console.log("body inscripcion:", body)
  let insciptionService = new InscriptionService();
  let dataIns = await insciptionService.getInscriptionsById(body.inscriptionId) as any;
      // control inscription id
      if (!dataIns) throw CustomError.badRequest('El id de la inscripción no existe');
      const dataInsPrice:TPriceOutput = dataIns.price;
      if (!dataInsPrice) throw CustomError.badRequest('El id del precio no existe');
      //control pay month
      let totalInscription = dataInsPrice.inscription;

      let totalAmount = dataInsPrice.month;
      let amountPending = dataInsPrice.month-body.amountPaid;
      if (body.amountPaid > totalAmount) throw CustomError.badRequest(`revise el pago realizado de la inscripción, la institucion no puede salir deviendo, total mes a pagar:${totalAmount}`);

      let state = amountPending <= 0 ? true : false;
      let startDate= new Date();
      let endDate= new Date();
      let studentId = dataIns.student.id;

		const MonthlyFee = await createMonthlyFee({ 
      inscriptionId: body.inscriptionId,// TOMAR EN CUENTA inscriptions terminacion con s
      totalInscription: totalInscription,
      startDate,
      endDate,
      totalAmount,
      amountPending,
      studentId,
      amountPaid: body.amountPaid,
      state
    }) as any;

    const MonthlyFeePayment = await createMonthlyFeePayment({
      transactionNumber: body.transactionNumber,
      payMethod: body.payMethod,
      amount:body.amountPaid,
      paymentDate: new Date(), 
      commitmentDate: new Date(), 
      isInscription: true, 
      monthlyFeeId: MonthlyFee.id
    })
     const dataSend =  CustomSuccessful.response({result: {...MonthlyFee,message:'create'} });
     return res.status(201).json(dataSend)

      }

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
    console.log("getMonthlyFee:", MonthlyFees)
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