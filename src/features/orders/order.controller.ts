import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service';

const orderService = new OrderService();

export class OrderController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const operatorId = req.user!.id;
      const order = await orderService.create(operatorId, req.body);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const order = await orderService.findById(id);
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const updated = await orderService.updateStatus(id, req.body);
      res.json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }
}