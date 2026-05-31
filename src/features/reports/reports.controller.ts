import { Request, Response, NextFunction } from 'express';
import { ReportsService } from './reports.service';

const reportsService = new ReportsService();

export class ReportsController {
  async lowStock(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const products = await reportsService.getLowStock();
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  }
}