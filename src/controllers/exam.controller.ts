import { Request, Response } from 'express';
import { ApiResponseHandler } from '../utils/apiResponse';
import * as examRepo from '../repositories/exam.repo';
import logger from '../utils/logger';
import { BadRequestError, NotFoundError } from '../errors/api.errors';
import { Prisma } from '@prisma/client';

export const createExam = async (req: Request, res: Response) => {
    const examData: Prisma.ExamUncheckedCreateInput = req.body;

    // Validate input
    if (!examData.name) {
      throw new BadRequestError('Exam name is required');
    }

    if (!examData.businessId) {
        throw new BadRequestError('Business ID is required');
    }

    const exam = await examRepo.createExam(examData);
    
    logger.info(`Exam created successfully: ${examData.name}`);

    ApiResponseHandler.success(res, exam, 'Exam created successfully', 201); 
};

function getExamIdFromRequest(req: Request): number {
    const id = Number(req.params.id);
    if (Number.isInteger(id) && id > 0) {
        return id;
    }
    throw new BadRequestError('Course ID is required');
}

export const getExam = async (req: Request, res: Response) => {
    const id = getExamIdFromRequest(req);

    const exam = await examRepo.findExamById(id);
    if (!exam) {
        throw new NotFoundError('Exam not found');
    }

    logger.info(`Exam fetched successfully: ${exam.name}`);

    ApiResponseHandler.success(res, exam, 'Exam fetched successfully');
};

export const getExamWithCourses = async (req: Request, res: Response) => {
    const id = getExamIdFromRequest(req);
    
    const exam = await examRepo.findExamWithCourses(id);
    if (!exam) {
        throw new NotFoundError('Exam not found');
    }
    
    logger.info(`Exam with courses fetched successfully: ${exam.name}`);

    ApiResponseHandler.success(res, exam, 'Exam with courses fetched successfully');
};

export const updateExam = async (req: Request, res: Response) => {
    const id = getExamIdFromRequest(req);
    const examData: Prisma.ExamUncheckedUpdateInput = req.body;

    // Validate input
    if (examData.name !== undefined && typeof examData.name === 'string' && !examData.name.trim()) {
      throw new BadRequestError('Exam name cannot be empty');
    }

    const exam = await examRepo.updateExam(id, examData);
    
    logger.info(`Exam updated successfully: ${exam.name}`);

    ApiResponseHandler.success(res, exam, 'Exam updated successfully');
  
};

export const deleteExam = async (req: Request, res: Response) => {
    const id = getExamIdFromRequest(req);
    
    await examRepo.deleteExam(id);
    
    logger.info(`Exam deleted successfully: ID ${id}`);

    ApiResponseHandler.success(res, null, 'Exam deleted successfully');
};

