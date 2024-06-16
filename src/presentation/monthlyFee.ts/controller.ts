import { Response, Request } from 'express';
import { CustomError, PaginationDto, StaffDto } from '../../domain';
import {createMonthlyFee, getOneMonthlyFee, updateMonthlyFee, deleteMonthlyFee, getPricesByIdClasses, getOnePrice}  from '../services';
import { TMonthlyfeeInput } from '../../schemas/monthlyFee.schema';
import { StudentService } from '../services';
import { TPriceOutput } from '../../schemas/price';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  console.log(`${error}`);
  return res.status(500).json({ error: 'Internal server error' });
};

export async function createMonthlyFeeCtrl(
	req: Request<{}, {}, TMonthlyfeeInput>,
	res: Response
) {
  const body = req.body;
  console.log(req.body);

  let studentService = new StudentService();
	try {
     //find priceId
      let data = await getOnePrice(body.priceId) as any;
      const dataPrice:TPriceOutput = data.price;
      if (!dataPrice) throw CustomError.badRequest('El id del precio no existe');
      //control pay month
      let totalAmount = dataPrice.month;
      let amountPending = dataPrice.month - body.amountPaid;
      if (amountPending < 0 ) throw CustomError.badRequest('revise el pago realizado, la institucion no puede salir deviendo');
      let state = amountPending <= 0 ? true : false;
    // find student

    const student = await studentService.getStudent(body.studentId);
    console.log("student:",student);
    if (!student) throw CustomError.badRequest('El id del estudiante no existe'); 

		const MonthlyFee = await createMonthlyFee({...body, totalAmount, amountPending, state})
		 return res.status(201).json(MonthlyFee)
	} catch (error) {
    handleError(error, res)
	}
}

/* export const findMonthlyFeesCtrl = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const [error, paginationDto] = PaginationDto.create(+page, +limit);
  if (error) return res.status(400).json({ error });

  try {
    const  MonthlyFees = await getMonthlyFees(paginationDto!)
    return res.status(201).json(MonthlyFees)
  } catch (error) {
    handleError(error, res)
  }
} */

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
  req: Request<{id:string}, {}, TMonthlyfeeInput>,
	res: Response) => {

  const body = req.body;
  const id = req.params.id
  console.log(id)
  try {
    const  MonthlyFee = await updateMonthlyFee(parseInt(id),body )
    return res.status(201).json(MonthlyFee)
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