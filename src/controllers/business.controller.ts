import { Request, Response } from 'express';
import { ApiResponseHandler } from '../utils/apiResponse';
import logger from '../utils/logger';
import { AlreadyExistsError, BadRequestError, NotFoundError } from '../errors/api.errors';
import * as businessRepo from '../repositories/business.repo';
import { Prisma } from '@prisma/client';

export const createBusiness = async (req: Request, res: Response) => {
  const businessData: Prisma.BusinessUncheckedCreateInput = req.body;

  // Validate required fields
  if (!businessData.instituteName || businessData.instituteName.trim().length === 0) {
    throw new BadRequestError('Institute name is required');
  }

  // Check if business already exists (only allow one business record)
  const existingBusiness = await businessRepo.findFirstBusiness();
  if (existingBusiness) {
    throw new AlreadyExistsError('Business configuration already exists. Use update instead.');
  }

  const business = await businessRepo.createBusiness(businessData);

  logger.info(`Business created successfully: ${business.instituteName}`);

  ApiResponseHandler.success(res, business, 'Business created successfully', 201);

};

function getBusinessIdFromRequest(req: Request): number {
  const id = Number(req.params.id);
  if (Number.isInteger(id) && id > 0) {
    return id;
  }
  throw new BadRequestError('Business ID is required');
}

export const getBusiness = async (req: Request, res: Response) => {
  const id = getBusinessIdFromRequest(req);

    const business = await businessRepo.findBusinessById(id);
    if (!business) {
      throw new NotFoundError('Business not found');
    }
    logger.info(`Business fetched successfully: ${business.instituteName}`);
    ApiResponseHandler.success(res, business, 'Business fetched successfully');
};

export const updateBusiness = async (req: Request, res: Response) => {
    const id = getBusinessIdFromRequest(req);
    const businessData: Prisma.BusinessUncheckedUpdateInput = req.body;

    // Validate input
    if (businessData.instituteName !== undefined && typeof businessData.instituteName === 'string' && !businessData.instituteName.trim()) {
      throw new BadRequestError('Institute name cannot be empty');
    }

    // Validate that business exists
    const existingBusiness = await businessRepo.findBusinessById(id);
    if (!existingBusiness) {
      throw new NotFoundError('Business not found');
    }

    const business = await businessRepo.updateBusiness(id, businessData);
    
    logger.info(`Business updated successfully: ${business.instituteName}`);

    ApiResponseHandler.success(res, business, 'Business updated successfully');

};

export const deleteBusiness = async (req: Request, res: Response) => {
  const id = getBusinessIdFromRequest(req);
  
  // Validate that business exists
  const existingBusiness = await businessRepo.findBusinessById(id);
  if (!existingBusiness) {
    throw new NotFoundError('Business not found');
  }

  await businessRepo.deleteBusiness(id);

  ApiResponseHandler.success(res, null, 'Business deleted successfully');
};
