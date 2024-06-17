import { PrismaClient } from '@prisma/client';
import { StaffDto, CustomError, PaginationDto, CustomSuccessful, } from '../../domain';
import { TPriceInput } from '../../schemas/price';
import { bcryptAdapter } from '../../config';
import * as v from 'valibot';

const prisma = new PrismaClient();

export async function createPrice(input: TPriceInput) {
	try {
		const res = await prisma.price.create({data:{
      classesId: input.classesId,
      inscription: input.inscription,
      month: input.month,
      state: input.state,
    }});
    return res;
	} catch (error) {
		console.log(error)
		return error
	}
}

export async function getOnePrice(id:number) {
  try {
    const price = await prisma.price.findFirst({where: {id}})
    console.log(price)
    return CustomSuccessful.response({ result: {price}});
  } catch (error:any) {
    console.log(error.message)
    throw CustomError.internalServer('Internal Server Error');
  }
}

export async function getPricesByIdClasses(id:number, paginationDto: PaginationDto) {
  const { page, limit } = paginationDto;
  try {

    const [total, prices] = await Promise.all([
      prisma.price.count({ where: { AND:[{classesId:id},{state: true} ] } }),
      prisma.price.findMany({
        where: { AND:[{classesId:id},{state: true} ] },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          classes: true,
        }
      }),
    ]);

    return CustomSuccessful.response({
      result: {
      page: page,
      limit: limit,
      total: total,
      next: `/api/price/classes/?page=${(page + 1)}&limit=${limit}`,
      prev: (page - 1 > 0) ? `/api/price?page=${(page - 1)}&limit=${limit}` : null,
      prices
    }});

  } catch (error) {
    throw CustomError.internalServer('Internal Server Error');
  }
}

export async function getPrices(paginationDto: PaginationDto) {
  const { page, limit } = paginationDto;
  try {

    const [total, prices] = await Promise.all([
      prisma.price.count({ where: { state: true } }),
      prisma.price.findMany({
        where: {
          state: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          classes: true,
        }
      }),
    ]);

    return CustomSuccessful.response({
      result: {
      page: page,
      limit: limit,
      total: total,
      next: `/api/price?page=${(page + 1)}&limit=${limit}`,
      prev: (page - 1 > 0) ? `/api/price?page=${(page - 1)}&limit=${limit}` : null,
      prices
    }});

  } catch (error) {
    throw CustomError.internalServer('Internal Server Error');
  }
}

export async function updatePrice(id:number,input: TPriceInput) {
	try {
		const res = await prisma.price.update({where:{id},data:{
      classesId: input.classesId,
      inscription: input.inscription,
      month: input.month,
      state: input.state,
    }});
    return CustomSuccessful.response({ result: res });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

export async function deletePrice(id:number) {
	try {
		const res = await prisma.price.delete({where:{id}});
    return CustomSuccessful.response({ result: { message: 'Price Classes eliminado' } });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

