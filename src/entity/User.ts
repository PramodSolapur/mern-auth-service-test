import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
