import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { BackgroundController } from './background.controller';
import { BackgroundService } from './background.service';
import { Background } from './entities/background.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Background, UserAccount])],
  controllers: [BackgroundController],
  providers: [BackgroundService],
})
export class BackgroundModule {}
