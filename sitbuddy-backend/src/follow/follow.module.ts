import { UserModule } from 'src/user/user.module';
import { FollowController } from './follow.controller';
import { Follow } from './follow.entity';
import { FollowService } from './follow.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Follow]), forwardRef(() => UserModule)],
    controllers: [FollowController, ],
    providers: [FollowService, ],
    exports: [FollowService, ],
})
export class FollowModule {}
