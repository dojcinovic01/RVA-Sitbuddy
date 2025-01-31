import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "src/user/user.entity";

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.following, { onDelete: "CASCADE" })
  follower: User; // Korisnik koji prati

  @ManyToOne(() => User, (user) => user.followers, { onDelete: "CASCADE" })
  following: User; // Korisnik koji je praćen

  @CreateDateColumn()
  createdAt: Date; // Datum kada je praćenje počelo
}
