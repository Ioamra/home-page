import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreatePresetSearchBarDto } from './dto/create-preset-search-bar.dto';
import { UpdatePresetSearchBarDto } from './dto/update-preset-search-bar.dto';
import { PresetSearchBar } from './entities/preset-search-bar.entity';
import { PresetSearchBarService } from './preset-search-bar.service';

@Controller('preset-search-bar')
export class PresetSearchBarController {
  constructor(private readonly presetSearchBarService: PresetSearchBarService) {}

  @IsAdmin()
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public create(
    @Body() createPresetSearchBarDto: CreatePresetSearchBarDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<PresetSearchBar> {
    return this.presetSearchBarService.create(createPresetSearchBarDto, files?.image?.[0]);
  }

  @Get()
  public findAll(): Promise<PresetSearchBar[]> {
    return this.presetSearchBarService.findAll();
  }

  @IsAdmin()
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public update(
    @Param('id') id: string,
    @Body() updatePresetSearchBarDto: UpdatePresetSearchBarDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<UpdateResult> {
    return this.presetSearchBarService.update(id, updatePresetSearchBarDto, files?.image?.[0]);
  }

  @IsAdmin()
  @Delete(':id')
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.presetSearchBarService.remove(id);
  }
}
