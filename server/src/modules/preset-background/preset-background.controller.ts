import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePresetBackgroundDto } from './dto/create-preset-background.dto';
import { UpdatePresetBackgroundDto } from './dto/update-preset-background.dto';
import { PresetBackground } from './entities/preset-background.entity';
import { PresetBackgroundService } from './preset-background.service';

@Controller('preset-background')
export class PresetBackgroundController {
  constructor(private readonly presetBackgroundService: PresetBackgroundService) {}

  @IsAdmin()
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public create(
    @Body() createPresetBackgroundDto: CreatePresetBackgroundDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<PresetBackground> {
    return this.presetBackgroundService.create(createPresetBackgroundDto, files?.image?.[0]);
  }

  @Get()
  public findAll(): Promise<PresetBackground[]> {
    return this.presetBackgroundService.findAll();
  }

  @IsAdmin()
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public update(
    @Param('id') id: string,
    @Body() updatePresetBackgroundDto: UpdatePresetBackgroundDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<UpdateResult> {
    return this.presetBackgroundService.update(id, updatePresetBackgroundDto, files?.image?.[0]);
  }

  @IsAdmin()
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.presetBackgroundService.remove(id);
  }
}
