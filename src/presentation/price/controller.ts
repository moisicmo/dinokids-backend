import { Response, Request } from 'express';
import { CustomError, PaginationDto, StaffDto } from '../../domain';
import {createPrice, getPrices, getOnePrice, updatePrice, deletePrice, getPricesByIdClasses}  from '../services';
import { TPriceInput } from '../../schemas/price';

const handleError = (error: unknown, res: Response) => {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ error: error.message });
  }
  console.log(`${error}`);
  return res.status(500).json({ error: 'Internal server error' });
};

export async function createPriceCtrl(
	req: Request<{}, {}, TPriceInput>,
	res: Response
) {
  console.log(req.body);
	try {
		const price = await createPrice(req.body)
		 return res.status(201).json(price)
	} catch (error) {
    handleError(error, res)
	}
}

export const findPricesCtrl = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const [error, paginationDto] = PaginationDto.create(+page, +limit);
  if (error) return res.status(400).json({ error });

  try {
    const  prices = await getPrices(paginationDto!)
    return res.status(201).json(prices)
  } catch (error) {
    handleError(error, res)
  }
}

export const findOnePriceCtrl = async (req: Request, res: Response) => {

  const id = req.params.id
  console.log(id)
  try {
    const  price = await getOnePrice(parseInt(id))
    return res.status(201).json(price)
  } catch (error) {
    handleError(error, res)
  }
}

export const updatePriceCtrl = async (
  req: Request<{id:string}, {}, TPriceInput>,
	res: Response) => {

  const body = req.body;
  const id = req.params.id
  console.log(id)
  try {
    const  price = await updatePrice(parseInt(id),body )
    return res.status(201).json(price)
  } catch (error) {
    handleError(error, res)
  }
}

export const deletePriceCtrl = async (
  req: Request<{id:string}, {}, TPriceInput>,
	res: Response) => {

  const body = req.body;
  const id = req.params.id
  console.log(id)
  try {
    const  price = await deletePrice(parseInt(id) )
    return res.status(201).json(price)
  } catch (error) {
    handleError(error, res)
  }
}

export const findPricesByClassesIdCtrl = async (req: Request, res: Response) => {
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
}