import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';
import { Advertisment } from 'src/advertisment/advertisment.entity';
import { Review } from 'src/review/review.entity';

export enum ReportType {
  USER = 'user',
  ADVERTISMENT = 'advertisment',
  REVIEW = 'review',
}

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  reportedBy: User; // Korisnik koji je poslao prijavu

  @ManyToOne(() => User, { nullable: true, eager: true, onDelete: 'CASCADE' })
  reportedUser?: User; // Prijavljeni korisnik

  @ManyToOne(() => Advertisment, { nullable: true, eager: true, onDelete: 'CASCADE' })
  reportedAdvertisment?: Advertisment; // Prijavljeni oglas

  @ManyToOne(() => Review, { nullable: true, eager: true, onDelete: 'CASCADE' })
  reportedReview?: Review; // Prijavljena recenzija

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType; // Tip prijave

  @Column()
  reason: string; // Razlog prijave

  @CreateDateColumn()
  createdAt: Date; // Datum kreiranja prijave
}
