import { Router } from 'express'
import { AppDataSource } from '../config/data-source'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { Roles } from '../constants'
import { User } from '../entity/User'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/userService'
import logger from '../config/logger'

const router = Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const userController = new UserController(userService, logger)

router.post('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
)

// router.get('/', (req: TenantRequest, res: Response, next: NextFunction) =>
//     tenantController.getAll(req, res, next),
// )

// router.get('/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
//     tenantController.getOne(req, res, next),
// )

// router.patch(
//     '/:id',
//     authenticate,
//     canAccess([Roles.ADMIN]),
//     tenantValidator,
//     (req: TenantRequest, res: Response, next: NextFunction) =>
//         tenantController.update(req, res, next),
// )

// router.delete(
//     '/:id',
//     authenticate,
//     canAccess([Roles.ADMIN]),
//     (req: TenantRequest, res: Response, next: NextFunction) =>
//         tenantController.deleteById(req, res, next),
// )

export default router
