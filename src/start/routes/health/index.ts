import express, { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
const router = express.Router();

export const healthRoute = (): Router => {
  router.get('/health-routing', (req: Request, res: Response) => {
    res.status(StatusCodes.OK).send('[Health Router] is health');
  });

  return router;
};
