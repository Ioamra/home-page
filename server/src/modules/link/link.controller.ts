import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseInterceptors } from '@nestjs/common';
import { IsConnected } from 'src/common/decorators/is-connected.decorator';
import { CustomRequest } from 'src/common/models/request.model';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from './entities/link.entity';
import { LinkService } from './link.service';

@Controller('link')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @Post()
  @IsConnected()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public create(
    @Request() req: CustomRequest,
    @Body() createLinkDto: CreateLinkDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<Link> {
    return this.linkService.create(req.user.id, createLinkDto, files?.image?.[0]);
  }

  @IsConnected()
  @Get()
  public findByUserAccount(@Request() req: CustomRequest): Promise<Link[]> {
    return this.linkService.findByUserAccount(req.user.id);
  }

  @Patch(':id')
  @IsConnected()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public update(
    @Param('id') id: string,
    @Body() updateLinkDto: UpdateLinkDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<UpdateResult> {
    return this.linkService.update(id, updateLinkDto, files?.image?.[0]);
  }

  @Delete(':id')
  @IsConnected()
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.linkService.remove(id);
  }
}
