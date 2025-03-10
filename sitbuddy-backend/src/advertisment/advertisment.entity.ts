import { User } from "src/user/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Report } from "src/report/report.entity";


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

  @OneToMany(() => Report, (report) => report.reportedAdvertisment)
  reports: Report[]; // Prijave vezane za ovaj oglas

}
