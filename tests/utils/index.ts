import { DataSource, Repository } from 'typeorm'
import { Tenant } from '../../src/entity/Tenant'

export const truncateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name)
        await repository.clear()
    }
}

export const createTenant = async (repository: Repository<Tenant>) => {
    const tenant = await repository.save({
        name: 'test tenant',
        address: 'test address',
    })

    return tenant
}
