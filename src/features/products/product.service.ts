import prisma from '../../lib/prisma';
import { AppError } from '../../errors/AppError';
import { CreateProductInput, UpdateProductInput, ProductResponse } from './product.types';

export class ProductService {
  async findAll(category?: string): Promise<ProductResponse[]> {
    const where = category
      ? { category: { name: category } }
      : {};
    
    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { id: 'asc' },
    });
    return products;
  }

  async findById(id: number): Promise<ProductResponse> {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }
    return product;
  }

  async create(data: CreateProductInput): Promise<ProductResponse> {
    // Validar existencia de la categoría
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new AppError('La categoría no existe', 400);
    }

    // Verificar unicidad del SKU
    const existingProduct = await prisma.product.findUnique({
      where: { sku: data.sku },
    });
    if (existingProduct) {
      throw new AppError('El SKU ya está registrado', 409);
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        stock: data.stock,
        minStock: data.minStock,
        price: data.price,
        categoryId: data.categoryId,
      },
      include: { category: true },
    });
    return product;
  }

  async update(id: number, data: UpdateProductInput): Promise<ProductResponse> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    if (data.categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new AppError('La categoría no existe', 400);
      }
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...data,
      },
      include: { category: true },
    });
    return updated;
  }

  async delete(id: number): Promise<void> {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Producto no encontrado', 404);
    }

    await prisma.product.delete({ where: { id } });
  }
}