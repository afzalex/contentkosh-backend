import { Request, Response } from 'express';
import { ApiResponseHandler } from '../utils/apiResponse';
import * as announcementRepo from '../repositories/announcement.repo';
import * as businessRepo from '../repositories/business.repo';
import logger from '../utils/logger';
import { BadRequestError, NotFoundError } from '../errors/api.errors';
import { Prisma } from '@prisma/client';

export const createAnnouncement = async (req: Request, res: Response) => {
    const announcementData: Prisma.AnnouncementUncheckedCreateInput = req.body;

    // Validate input
    if (!announcementData.heading || !announcementData.heading.trim()) {
      throw new BadRequestError('Announcement heading is required');
    }

    if (!announcementData.content || !announcementData.content.trim()) {
      throw new BadRequestError('Announcement content is required');
    }

    if (!announcementData.startDate || !announcementData.endDate) {
      throw new BadRequestError('Start date and end date are required');
    }

    if (!announcementData.businessId) {
      throw new BadRequestError('Business ID is required');
    }

    // Validate date range
    const startDate = new Date(announcementData.startDate);
    const endDate = new Date(announcementData.endDate);
    
    if (startDate >= endDate) {
      throw new BadRequestError('End date must be after start date');
    }

    // Check if business exists
    const business = await businessRepo.findBusinessById(announcementData.businessId);
    if (!business) {
      throw new NotFoundError('Business not found');
    }

    // Validate at least one role is selected
    if (!announcementData.visibleToAdmins && !announcementData.visibleToTeachers && !announcementData.visibleToStudents) {
      throw new BadRequestError('At least one role must be selected for visibility');
    }

    const announcement = await announcementRepo.createAnnouncement({
      ...announcementData,
      business: {
        connect: {
          id: announcementData.businessId
        }
      }
    });

    logger.info(`Announcement created successfully: ${announcementData.heading}`);

    ApiResponseHandler.success(res, announcement, 'Announcement created successfully', 201);
};

function getAnnouncementIdFromRequest(req: Request): number {
    const id = Number(req.params.id);
    if (Number.isInteger(id) && id > 0) {
        return id;
    }
    throw new BadRequestError('Announcement ID is required');
}

export const getAnnouncement = async (req: Request, res: Response) => {
    const id = getAnnouncementIdFromRequest(req);

    const announcement = await announcementRepo.findAnnouncementById(id);
    if (!announcement) {
        throw new NotFoundError('Announcement not found');
    }

    logger.info(`Announcement fetched successfully: ${announcement.heading}`);

    ApiResponseHandler.success(res, announcement, 'Announcement fetched successfully');
};

export const getAnnouncementsByBusiness = async (req: Request, res: Response) => {
    const businessId = Number(req.params.businessId);
    if (!Number.isInteger(businessId) || businessId <= 0) {
        throw new BadRequestError('Valid Business ID is required');
    }

    const activeOnly = req.query.active === 'true';
    
    let announcements;
    if (activeOnly) {
        announcements = await announcementRepo.findActiveAnnouncementsByBusinessId(businessId);
    } else {
        announcements = await announcementRepo.findAnnouncementsByBusinessId(businessId);
    }

    logger.info(`Announcements fetched for business ${businessId}`);

    ApiResponseHandler.success(res, announcements, 'Announcements fetched successfully');
};

export const getAnnouncementsByRole = async (req: Request, res: Response) => {
    const businessId = Number(req.params.businessId);
    if (!Number.isInteger(businessId) || businessId <= 0) {
        throw new BadRequestError('Valid Business ID is required');
    }

    const role = req.query.role as string;
    if (!role) {
        throw new BadRequestError('Role parameter is required');
    }

    const validRoles = ['ADMIN', 'SUPERADMIN', 'TEACHER', 'STUDENT'];
    if (!validRoles.includes(role)) {
        throw new BadRequestError('Invalid role. Must be ADMIN, SUPERADMIN, TEACHER, or STUDENT');
    }

    const announcements = await announcementRepo.findAnnouncementsByRole(businessId, role);

    logger.info(`Announcements fetched for business ${businessId} and role ${role}`);

    ApiResponseHandler.success(res, announcements, 'Announcements fetched successfully');
};

export const getAnnouncementsByDateRange = async (req: Request, res: Response) => {
    const businessId = Number(req.params.businessId);
    if (!Number.isInteger(businessId) || businessId <= 0) {
        throw new BadRequestError('Valid Business ID is required');
    }

    const startDateStr = req.query.startDate as string;
    const endDateStr = req.query.endDate as string;

    if (!startDateStr || !endDateStr) {
        throw new BadRequestError('Start date and end date are required');
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestError('Invalid date format');
    }

    if (startDate >= endDate) {
        throw new BadRequestError('End date must be after start date');
    }

    const announcements = await announcementRepo.findAnnouncementsByDateRange(businessId, startDate, endDate);

    logger.info(`Announcements fetched for business ${businessId} in date range`);

    ApiResponseHandler.success(res, announcements, 'Announcements fetched successfully');
};

export const updateAnnouncement = async (req: Request, res: Response) => {
    const id = getAnnouncementIdFromRequest(req);
    const announcementData: Prisma.AnnouncementUncheckedUpdateInput = req.body;

    // Validate input
    if (announcementData.heading !== undefined && !announcementData.heading.toString().trim()) {
      throw new BadRequestError('Announcement heading cannot be empty');
    }

    if (announcementData.content !== undefined && !announcementData.content.toString().trim()) {
      throw new BadRequestError('Announcement content cannot be empty');
    }

    // Validate date range if both dates are provided
    if (announcementData.startDate && announcementData.endDate) {
      const startDate = new Date(announcementData.startDate.toString());
      const endDate = new Date(announcementData.endDate.toString());
      
      if (startDate >= endDate) {
        throw new BadRequestError('End date must be after start date');
      }
    }

    // Validate at least one role is selected if visibility fields are being updated
    if (announcementData.visibleToAdmins !== undefined || 
        announcementData.visibleToTeachers !== undefined || 
        announcementData.visibleToStudents !== undefined) {
      
      const currentAnnouncement = await announcementRepo.findAnnouncementById(id);
      if (!currentAnnouncement) {
        throw new NotFoundError('Announcement not found');
      }

      const newVisibleToAdmins = announcementData.visibleToAdmins ?? currentAnnouncement.visibleToAdmins;
      const newVisibleToTeachers = announcementData.visibleToTeachers ?? currentAnnouncement.visibleToTeachers;
      const newVisibleToStudents = announcementData.visibleToStudents ?? currentAnnouncement.visibleToStudents;

      if (!newVisibleToAdmins && !newVisibleToTeachers && !newVisibleToStudents) {
        throw new BadRequestError('At least one role must be selected for visibility');
      }
    }

    const announcement = await announcementRepo.updateAnnouncement(id, announcementData);

    logger.info(`Announcement updated successfully: ${announcement.heading}`);

    ApiResponseHandler.success(res, announcement, 'Announcement updated successfully');
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
    const id = getAnnouncementIdFromRequest(req);

    await announcementRepo.deleteAnnouncement(id);

    logger.info(`Announcement deleted successfully: ID ${id}`);

    ApiResponseHandler.success(res, null, 'Announcement deleted successfully');
};
