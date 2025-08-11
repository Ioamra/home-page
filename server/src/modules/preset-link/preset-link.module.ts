import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PresetLink } from './entities/preset-link.entity';
import { PresetLinkController } from './preset-link.controller';
import { PresetLinkService } from './preset-link.service';

@Module({
  imports: [TypeOrmModule.forFeature([PresetLink])],
  controllers: [PresetLinkController],
  providers: [PresetLinkService],
})
export class PresetLinkModule {}
