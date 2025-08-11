import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseInterceptors } from '@nestjs/common';
import { IsConnected } from 'src/common/decorators/is-connected.decorator';
import { CustomRequest } from 'src/common/models/request.model';
import { DeleteResult, UpdateResult } from 'typeorm';
import { CreateSearchBarDto } from './dto/create-search-bar.dto';
import { UpdateSearchBarDto } from './dto/update-search-bar.dto';
import { SearchBar } from './entities/search-bar.entity';
import { SearchBarService } from './search-bar.service';

@Controller('search-bar')
export class SearchBarController {
  constructor(private readonly searchBarService: SearchBarService) {}

  @Post()
  @IsConnected()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public create(
    @Request() req: CustomRequest,
    @Body() createSearchBarDto: CreateSearchBarDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<SearchBar> {
    return this.searchBarService.create(req.user.id, createSearchBarDto, files?.image?.[0]);
  }

  @IsConnected()
  @Get()
  public findByUserAccount(@Request() req: CustomRequest): Promise<SearchBar[]> {
    return this.searchBarService.findByUserAccount(req.user.id);
  }

  @Patch(':id')
  @IsConnected()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public update(
    @Param('id') id: string,
    @Body() updateSearchBarDto: UpdateSearchBarDto,
    @UploadedFiles() files?: { image?: MemoryStorageFile[] },
  ): Promise<UpdateResult> {
    return this.searchBarService.update(id, updateSearchBarDto, files?.image?.[0]);
  }

  @Delete(':id')
  @IsConnected()
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.searchBarService.remove(id);
  }
}
