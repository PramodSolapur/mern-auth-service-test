import { NextFunction, Request, Response } from 'express'
import { TenantService } from '../services/tenantService'
import { TenantRequest } from '../types'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}

    async create(req: TenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { name, address } = req.body

        this.logger.debug('Request for creating a tenant', req.body)

        try {
            const tenant = await this.tenantService.create({ name, address })
            this.logger.info('Tenant has been created', { id: tenant.id })
            res.status(201).json({ id: tenant.id })
        } catch (error) {
            next(error)
            return
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll()
            res.status(200).json(tenants)
        } catch (error) {
            next(error)
            return
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            this.logger.debug('Searching tenant', { id })
            const tenant = await this.tenantService.getOne(Number(id))
            if (!tenant) {
                const error = createHttpError(404, 'tenant not found')
                next(error)
                return
            }
            res.status(200).json(tenant)
        } catch (error) {
            next(error)
            return
        }
    }

    async update(req: TenantRequest, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req)
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() })
        }

        const { name, address } = req.body

        this.logger.debug('Request for creating a tenant', req.body)

        try {
            const { id } = req.params
            const tenant = await this.tenantService.getOne(Number(id))
            if (!tenant) {
                const error = createHttpError(404, 'tenant not found')
                next(error)
                return
            }
            const updatedTenant = await this.tenantService.update(
                { name, address },
                Number(id),
            )
            res.status(200).json(updatedTenant)
        } catch (error) {
            next(error)
        }
    }

    async deleteById(req: TenantRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const tenant = await this.tenantService.getOne(Number(id))
            if (!tenant) {
                const error = createHttpError(404, 'tenant not found')
                next(error)
                return
            }
            await this.tenantService.deleteById(Number(id))
            res.status(200).json({})
        } catch (error) {
            next(error)
        }
    }
}
