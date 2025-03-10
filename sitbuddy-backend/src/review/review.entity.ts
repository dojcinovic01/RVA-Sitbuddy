import { User } from "src/user/user.entity";
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Report } from "src/report/report.entity";


@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comment: string;

  @Column()
  rating: number;

  @ManyToOne(() => User, (user) => user.reviewsFrom, { eager: true, onDelete: "CASCADE" })
  reviewFrom: User;

  @ManyToOne(() => User, (user) => user.reviewsTo, { eager: true, onDelete: "CASCADE" })
  reviewTo: User;

  @OneToMany(() => Report, (report) => report.reportedReview)
  reports: Report[]; // Prijave vezane za ovu recenziju
}
