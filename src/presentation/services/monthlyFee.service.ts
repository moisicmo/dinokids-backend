import { PrismaClient } from '@prisma/client';
import { CustomError, PaginationDto, CustomSuccessful, } from '../../domain';
import { TMonthlyfeeInput } from '../../schemas/monthlyFee.schema';

const prisma = new PrismaClient();

export async function createMonthlyFee(input: TMonthlyfeeInput) {
	try {
		const res = await prisma.monthlyFee.createManyAndReturn({data:{
      inscriptionId: input.inscriptionId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      totalAmount: input.totalAmount,
      amountPending:  input.amountPending,
      studentId: input.studentId,
      amountPaid: input.amountPaid,
      state: input.state,
    }});
    console.log("create monthlyFee:", res)
    return res;
	} catch (error) {
		console.log("error monthlyFee create:",error)
		return error
	}
}

export async function getOneMonthlyFee(id:number) {
  try {
    const monthlyFee = await prisma.monthlyFee.findFirst({where: {id}})
    console.log("monthlyFee:",monthlyFee)
    return CustomSuccessful.response({ result: {monthlyFee} });
  } catch (error:any) {
    console.log(error.message)
    throw CustomError.internalServer('Internal Server Error');
  }
}

export async function getMonthlyFee(paginationDto: PaginationDto) {
  const { page, limit } = paginationDto;
  try {

    const [total, monthlyFees] = await Promise.all([
      prisma.monthlyFee.count({ where: { state: false } }),
      prisma.monthlyFee.findMany({
        where: {
          state: false,
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          student: {
            include: {
              user: true,
            },
          },
          inscriptions:true,
        }
      }),
    ]);

    return CustomSuccessful.response({
      result: {
      page: page,
      limit: limit,
      total: total,
      next: `/api/monthlyfee?page=${(page + 1)}&limit=${limit}`,
      prev: (page - 1 > 0) ? `/api/monthlyfee?page=${(page - 1)}&limit=${limit}` : null,
      monthlyFees
    }});

  } catch (error) {
    throw CustomError.internalServer('Internal Server Error');
  }
} 

/* export async function getPricesByIdClasses(id:number, paginationDto: PaginationDto) {
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
} */

/* */

export async function updateMonthlyFee(id:number,input: TMonthlyfeeInput) {
	try {
		const res = await prisma.monthlyFee.update({where:{id},data:{
      inscriptionId: input.inscriptionId,
      startDate: new Date(input.startDate),
      endDate: new Date(input.endDate),
      totalAmount: input.totalAmount,
      amountPending: input.amountPending,
      studentId: input.studentId,
      amountPaid: input.amountPaid,
      state: input.state,
    }});
    return CustomSuccessful.response({ result: res });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

export async function deleteMonthlyFee(id:number) {
	try {
		const res = await prisma.monthlyFee.delete({where:{id}});
    return CustomSuccessful.response({ result: { message: 'Cuota Mensual Eliminado' } });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

