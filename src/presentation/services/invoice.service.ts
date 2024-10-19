import { PrismaClient } from '@prisma/client';
import { CustomError, PaginationDto, CustomSuccessful, } from '../../domain';
import { TInvoiceInput } from '../../schemas/invoice.schema';

const prisma = new PrismaClient();

export async function createInvoice(input: TInvoiceInput) {
	try {
		const res = await prisma.invoice.create(
      {
        data:{
          ...input,
        }
      });
    return res;
	} catch (error) {
		console.log(error)
		return error
	}
}

export async function getOneInvoice(id:number) {
  try {
    const invoice = await prisma.invoice.findFirst({where: {id}})
    //console.log("monthlyFeePayment services:",monthlyFeePayment)
    return CustomSuccessful.response({ result: {invoice} });
  } catch (error:any) {
    console.log(error.message)
    throw CustomError.internalServer('Internal Server Error');
  }
}

export async function getInvoice(paginationDto: PaginationDto) {
  const { page, limit } = paginationDto;
  try {

    const [total, monthlyFeePayments] = await Promise.all([
      prisma.invoice.count(),
      prisma.invoice.findMany({
        skip: (page - 1) * limit,
        take: limit,
        include: {
          monthlyFee: {
            include: {
              student: true,
              inscriptions: true,
          }
        },
        student:true,
      }}),
    ]);

    return CustomSuccessful.response({
      result: {
      page: page,
      limit: limit,
      total: total,
      next: `/api/invoice?page=${(page + 1)}&limit=${limit}`,
      prev: (page - 1 > 0) ? `/api/invoice?page=${(page - 1)}&limit=${limit}` : null,
      monthlyFeePayments
    }});

  } catch (error) {
    throw CustomError.internalServer('Internal Server Error');
  }
} 

export async function updateInvoice(id:number,input: TInvoiceInput) {
	try {
		const res = await prisma.invoice.update({where:{id},data: input});
    return CustomSuccessful.response({ result: res });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

export async function deleteInvoicePayment(id:number) {
	try {
		const res = await prisma.invoice.delete({where:{id}});
    return CustomSuccessful.response({ result: { message: 'invoice Eliminado' } });
	} catch (error) {
		console.log(error)
		throw CustomError.internalServer('Internal Server Error');
	}
}

