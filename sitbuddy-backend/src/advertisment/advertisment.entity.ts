import { User } from "src/user/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";

@Entity()
export class Advertisment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToOne(() => User, (user) => user.advertisment, { eager: true, onDelete: "CASCADE" })
  @JoinColumn()
  adFrom: User;

}
