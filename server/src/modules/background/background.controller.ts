import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseInterceptors } from '@nestjs/common';
import { IsConnected } from 'src/common/decorators/is-connected.decorator';
import { CustomRequest } from 'src/common/models/request.model';
import { DeleteResult, UpdateResult } from 'typeorm';
import { BackgroundService } from './background.service';
import { CreateBackgroundDto } from './dto/create-background.dto';
import { UpdateBackgroundDto } from './dto/update-background.dto';
import { Background } from './entities/background.entity';

@Controller('background')
export class BackgroundController {
  constructor(private readonly backgroundService: BackgroundService) {}

  @Post()
  @IsConnected()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public create(
    @Request() req: CustomRequest,
    @Body() createBackgroundDto: CreateBackgroundDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<Background> {
    return this.backgroundService.create(req.user.id, createBackgroundDto, files?.image?.[0]);
  }

  @IsConnected()
  @Get()
  public findByUserAccount(@Request() req: CustomRequest): Promise<Background[]> {
    return this.backgroundService.findByUserAccount(req.user.id);
  }

  @Patch(':id')
  @IsConnected()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public update(
    @Param('id') id: string,
    @Body() updateBackgroundDto: UpdateBackgroundDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<UpdateResult> {
    return this.backgroundService.update(+id, updateBackgroundDto, files?.image?.[0]);
  }

  @Delete(':id')
  @IsConnected()
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.backgroundService.remove(+id);
  }
}
