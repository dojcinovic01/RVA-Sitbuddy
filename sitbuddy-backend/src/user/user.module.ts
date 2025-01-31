import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ReviewModule } from 'src/review/review.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => ReviewModule)], // Registruje User entitet za rad sa bazom
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Omogućava deljenje UserService-a sa drugim modulima
})
export class UserModule {}
