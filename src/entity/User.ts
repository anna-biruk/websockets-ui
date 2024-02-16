import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  constructor(name: string, password: string) {
    this.name = name;
    this.password = password;
  }
  @PrimaryGeneratedColumn("uuid")
  id!: string;
  @Column({ type: "varchar" })
  @Column({ type: "varchar" })
  name: string;
  @Column({ type: "varchar" })
  password: string;
}
