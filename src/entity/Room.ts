import { BaseEntity, Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => User, (user) => user.room)
  users?: User[];
}
