import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePresetLinkDto } from './dto/create-preset-link.dto';
import { UpdatePresetLinkDto } from './dto/update-preset-link.dto';
import { PresetLink } from './entities/preset-link.entity';
import { PresetLinkService } from './preset-link.service';

@Controller('preset-link')
export class PresetLinkController {
  constructor(private readonly presetLinkService: PresetLinkService) {}

  @IsAdmin()
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public create(@Body() createPresetLinkDto: CreatePresetLinkDto, @UploadedFiles() files?: { image?: MemoryStorageFile[] }): Promise<PresetLink> {
    return this.presetLinkService.create(createPresetLinkDto, files?.image?.[0]);
  }

  @Get()
  public findAll(): Promise<PresetLink[]> {
    return this.presetLinkService.findAll();
  }

  @IsAdmin()
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public update(
    @Param('id') id: string,
    @Body() updatePresetLinkDto: UpdatePresetLinkDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<UpdateResult> {
    return this.presetLinkService.update(id, updatePresetLinkDto, files?.image?.[0]);
  }

  @IsAdmin()
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.presetLinkService.remove(id);
  }
}
