import { NextFunction, Response, Router } from 'express'
import { TenantController } from '../controllers/TenantController'
import { TenantService } from '../services/tenantService'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import { TenantRequest } from '../types'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'
import tenantValidator from '../validators/tenant-validator'

const router = Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService, logger)

router.post(
    '/',
    tenantValidator,
    authenticate,
    canAccess([Roles.ADMIN]),
    (req: TenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
)

export default router
