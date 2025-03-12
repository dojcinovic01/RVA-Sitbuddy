import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { UserModule } from 'src/user/user.module';
import { AdvertismentModule } from 'src/advertisment/advertisment.module';

@Module({
    imports: [TypeOrmModule.forFeature([Review]),forwardRef(() => UserModule), forwardRef(() => AdvertismentModule)],
    controllers: [ReviewController],
    providers: [ReviewService],
    exports: [ReviewService],
})
export class ReviewModule { }

