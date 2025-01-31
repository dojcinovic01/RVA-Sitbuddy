import { AdvertismentController } from './advertisment.controller';
import { forwardRef, Module } from '@nestjs/common';
import { AdvertismentService } from './advertisment.service';
import { Advertisment } from './advertisment.entity';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Advertisment]), forwardRef(() => UserModule)],
    controllers: [AdvertismentController,],
    providers: [AdvertismentService],
    exports: [AdvertismentService],
})
export class AdvertismentModule { }
