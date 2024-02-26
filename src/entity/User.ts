import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './Room';

@Entity()
export class User {
  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }

  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  password: string;

  @ManyToOne(() => Room, (room) => room.users)
  room?: Room;
}
