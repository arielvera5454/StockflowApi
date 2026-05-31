import prisma from '../../lib/prisma';
import { AppError } from '../../errors/AppError';
import {
  CreateOrderInput,
  OrderResponse,
  UpdateStatusInput,
} from './order.types';

// Tipo que representa la estructura exacta que devuelve la consulta
interface OrderWithItems {
  id: number;
  operatorId: number;
  status: string;
  createdAt: Date;
  items: {
    productId: number;
    quantity: number;
    priceAtOrder: number;
    product: {
      name: string;
    };
  }[];
}

export class OrderService {
  async create(operatorId: number, data: CreateOrderInput): Promise<OrderResponse> {
    const order: OrderWithItems = await prisma.$transaction(async (tx) => {
      // 1. Obtener productos necesarios con los campos mínimos
      const productIds = data.items.map((i) => i.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, stock: true, price: true },
      });

      if (products.length !== productIds.length) {
        throw new AppError('Uno o más productos no existen', 400);
      }

      // Mapa para acceder rápido
      const productMap = new Map(products.map((p) => [p.id, p]));

      // Validar stock
      for (const item of data.items) {
        const product = productMap.get(item.productId)!;
        if (product.stock < item.quantity) {
          throw new AppError(
            `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}`,
            400
          );
        }
      }

      // Descontar stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Crear orden
      const createdOrder = await tx.order.create({
        data: {
          operatorId,
          status: 'PENDING',
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtOrder: productMap.get(item.productId)!.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      });

      return createdOrder as unknown as OrderWithItems;
    });

    return this.mapOrderResponse(order);
  }

  async findById(orderId: number): Promise<OrderResponse> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Pedido no encontrado', 404);
    }

    return this.mapOrderResponse(order as unknown as OrderWithItems);
  }

  async updateStatus(orderId: number, data: UpdateStatusInput): Promise<OrderResponse> {
    const updatedOrder: OrderWithItems = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });

      if (!order) {
        throw new AppError('Pedido no encontrado', 404);
      }

      if (order.status === 'CANCELLED') {
        throw new AppError('El pedido ya ha sido cancelado', 409);
      }
      if (order.status === 'DISPATCHED') {
        throw new AppError('El pedido ya ha sido despachado y no puede modificarse', 409);
      }

      if (data.status === 'CANCELLED') {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: data.status },
        include: {
          items: {
            include: {
              product: {
                select: { name: true },
              },
            },
          },
        },
      });

      return updated as unknown as OrderWithItems;
    });

    return this.mapOrderResponse(updatedOrder);
  }

  private mapOrderResponse(order: OrderWithItems): OrderResponse {
    return {
      id: order.id,
      operatorId: order.operatorId,
      status: order.status,
      createdAt: order.createdAt,
      items: order.items.map((item) => ({
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
      })),
    };
  }
}