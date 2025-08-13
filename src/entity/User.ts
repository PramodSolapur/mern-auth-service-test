import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Tenant } from './Tenant'

// Set  "strictPropertyInitialization": false in tasconfig.json file

@Entity({
    name: 'users',
})
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    role: string

    @ManyToOne(() => Tenant)
    tenant: Tenant
}
