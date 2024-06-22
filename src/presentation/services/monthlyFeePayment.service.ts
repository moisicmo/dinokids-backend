import { PrismaClient } from '@prisma/client';
import { CustomError, PaginationDto, CustomSuccessful, } from '../../domain';
import { TMonthlyFeePaymentInput } from '../../schemas/monthlyFeePayment';

const prisma = new PrismaClient();

export async function createMonthlyFeePayment(input: TMonthlyFeePaymentInput) {
	try {
		const res = await prisma.monthlyFeePayment.create({data:{
      monthlyFeeId: input.monthlyFeeId,
      amount: input.amount,
      paymentDate: input.paymentDate,
      commitmentDate: new Date(input.commitmentDate),
      transactionNumber: input.transactionNumber,
      isInscription:  input.isInscription,
      payMethod: input.payMethod,
    }});
    return res;
	} catch (error) {
		console.log(error)
		return error
	}
}

export async function getOneMonthlyFeePayment(id:number) {
  try {
    const monthlyFeePayment = await prisma.monthlyFeePayment.findFirst({where: {monthlyFeeId: id}})
    console.log("monthlyFeePayment services:",monthlyFeePayment)
    return CustomSuccessful.response({ result: {monthlyFeePayment} });
  } catch (error:any) {
    console.log(error.message)
    throw CustomError.internalServer('Internal Server Error');
  }
}

export async function getMonthlyFeePayment(paginationDto: PaginationDto) {
  const { page, limit } = paginationDto;
  try {

    const [total, monthlyFeePayments] = await Promise.all([
      prisma.monthlyFeePayment.count(),
      prisma.monthlyFeePayment.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          monthlyFee: {
            include: {
              student: true,
              inscriptions: true,
          }
        }
      }}),
    ]);

    return CustomSuccessful.response({
      result: {
      page: page,
      limit: limit,
      total: total,
      next: `/api/monthlyfeepayments?page=${(page + 1)}&limit=${limit}`,
      prev: (page - 1 > 0) ? `/api/monthlyfeepayments?page=${(page - 1)}&limit=${limit}` : null,
      monthlyFeePayments
    }});

  } catch (error) {
    throw CustomError.internalServer('Internal Server Error');
  }
} 

export async function updateMonthlyFeePayment(id:number,input: TMonthlyFeePaymentInput) {
	try {
		const res = await prisma.monthlyFeePayment.update({where:{id},data:{
      monthlyFeeId: input.monthlyFeeId,
      amount: input.amount,
      paymentDate: input.paymentDate,
      commitmentDate: new Date(input.commitmentDate),
      transactionNumber: input.transactionNumber,
      isInscription:  input.isInscription,
      payMethod: input.payMethod,
    }});
    return CustomSuccessful.response({ result: res });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

export async function deleteMonthlyFeePayment(id:number) {
	try {
		const res = await prisma.monthlyFeePayment.delete({where:{id}});
    return CustomSuccessful.response({ result: { message: 'pago de cuota Mensual Eliminado' } });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

