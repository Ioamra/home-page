import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresetBackground } from './entities/preset-background.entity';
import { PresetBackgroundController } from './preset-background.controller';
import { PresetBackgroundService } from './preset-background.service';

@Module({
  imports: [TypeOrmModule.forFeature([PresetBackground])],
  controllers: [PresetBackgroundController],
  providers: [PresetBackgroundService],
})
export class PresetBackgroundModule {}
