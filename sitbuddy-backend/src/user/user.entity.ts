import { Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne } from "typeorm";
import { Advertisment } from "src/advertisment/advertisment.entity";
import { Follow } from "src/follow/follow.entity";
import { Review } from "src/review/review.entity";
import { Report } from "src/report/report.entity";

export enum UserType {
  ADMIN = 'admin',
  SITTER = 'sitter',
  PARENT = 'parent',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserType })
  userType: UserType; 

  @OneToMany(() => Review, (review) => review.reviewFrom)
  reviewsFrom: Review[];

  @OneToMany(() => Review, (review) => review.reviewTo)
  reviewsTo: Review[];

  @OneToOne(() => Advertisment, (advertisment) => advertisment.adFrom)
  advertisment: Advertisment;

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[]; 

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[]; 

  @Column({ nullable: true }) profilePicture: string; 
  @Column({ nullable: true }) location: string;
  @Column({ nullable: true }) phoneNumber: string; 
  @Column({ nullable: true }) criminalRecordProof: string; 
  @Column({ nullable: true }) hourlyRate: number; 

  @OneToMany(() => Report, (report) => report.reportedBy)
  reportsFiled: Report[]; 

  @OneToMany(() => Report, (report) => report.reportedUser)
  reportsReceived: Report[]; 
}