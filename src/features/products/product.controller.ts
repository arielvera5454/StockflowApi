import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';

const productService = new ProductService();

export class ProductController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = req.query.category as string | undefined;
      const products = await productService.findAll(category);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id); // transformado ya por Zod
      const product = await productService.findById(id);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updated = await productService.update(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await productService.delete(id);
      res.status(200).json({ success: true, data: { message: 'Producto eliminado' } });
    } catch (error) {
      next(error);
    }
  }
}