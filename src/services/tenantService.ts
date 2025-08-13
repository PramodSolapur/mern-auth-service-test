import { Repository } from 'typeorm'
import { ITenant } from '../types'
import { Tenant } from '../entity/Tenant'

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData)
    }

    async getAll() {
        return this.tenantRepository.find()
    }

    async getOne(id: number) {
        return await this.tenantRepository.findOne({ where: { id } })
    }

    async update(tenantData: ITenant, id: number) {
        return await this.tenantRepository.update(id, tenantData)
    }

    async deleteById(id: number) {
        return await this.tenantRepository.delete(id)
    }
}
