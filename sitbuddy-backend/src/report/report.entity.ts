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

  @ManyToOne(() => User, (user) => user.id, { eager: true, onDelete: 'CASCADE' })
  reportedBy: User; // Korisnik koji je poslao prijavu

  @ManyToOne(() => User, { nullable: true, eager: true, onDelete: 'CASCADE' })
  reportedUser?: User; // Prijavljeni korisnik (ako je tip prijave USER)

  @ManyToOne(() => Advertisment, { nullable: true, eager: true, onDelete: 'CASCADE' })
  reportedAdvertisment?: Advertisment; // Prijavljeni oglas (ako je tip prijave ADVERTISMENT)

  @ManyToOne(() => Review, { nullable: true, eager: true, onDelete: 'CASCADE' })
  reportedReview?: Review; // Prijavljena recenzija (ako je tip prijave REVIEW)

  @Column({ type: 'enum', enum: ReportType })
  type: ReportType; // Tip prijave (user, advertisment, review)

  @Column()
  reason: string; // Razlog prijave

  @CreateDateColumn()
  createdAt: Date; // Datum kada je prijava napravljena
}
