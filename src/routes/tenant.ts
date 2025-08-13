import { NextFunction, Response, Router } from 'express'
import { json } from 'stream/consumers'
import { TenantController } from '../controllers/TenantController'
import { TenantService } from '../services/tenantService'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import { TenantRequest } from '../types'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'

const router = Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService, logger)

router.post(
    '/',
    authenticate,
    (req: TenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
)

export default router
