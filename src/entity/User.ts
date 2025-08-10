import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

// Set  "strictPropertyInitialization": false in tasconfig.json file

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    role: string
}
