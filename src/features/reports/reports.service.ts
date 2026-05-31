import prisma from '../../lib/prisma';
import { ProductResponse } from '../products/product.types'; 

export class ReportsService {
  async getLowStock(): Promise<ProductResponse[]> {
    const products = await prisma.product.findMany({
      where: {
        stock: {
          lte: prisma.product.fields.minStock, 
        },
      },
      include: {
        category: true,
      },
      orderBy: { stock: 'asc' },
    });
    return products;
  }
}