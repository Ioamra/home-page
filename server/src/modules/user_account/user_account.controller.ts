import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { Body, Controller, Delete, Get, Param, Patch, Request, UseInterceptors } from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IsConnected } from '../../common/decorators/is-connected.decorator';
import { CustomRequest } from '../../common/models/request.model';
import { UpdateUserAccountDto } from './dto/update-user_account.dto';
import { UserAccount } from './entities/user_account.entity';
import { UserAccountService } from './user_account.service';

@Controller('user-account')
export class UserAccountController {
  constructor(private readonly userAccountService: UserAccountService) {}

  @Get(':id')
  @IsConnected()
  public findOne(@Param('id') id: string): Promise<Partial<UserAccount>> {
    return this.userAccountService.findOne(+id);
  }

  @Get('my-info')
  @IsConnected()
  public findMyInfo(@Request() req: CustomRequest): Promise<Partial<UserAccount>> {
    return this.userAccountService.findOne(req.user.id);
  }

  @Patch(':id')
  @IsConnected()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public update(
    @Param('id') id: string,
    @Body() updateUserAccountDto?: UpdateUserAccountDto,
    @UploadedFiles() files?: { photo?: MemoryStorageFile[] },
  ): Promise<UpdateResult> {
    if (!files?.photo && Object.keys(updateUserAccountDto).length === 0) {
      throw new Error('No data to update');
    }
    if (files?.photo && Object.keys(updateUserAccountDto).length > 0) {
      void this.userAccountService.updatePhoto(+id, files.photo[0]);
      return this.userAccountService.update(+id, updateUserAccountDto);
    }
    if (files?.photo) {
      return this.userAccountService.updatePhoto(+id, files.photo[0]);
    }
    if (Object.keys(updateUserAccountDto).length > 0) {
      return this.userAccountService.update(+id, updateUserAccountDto);
    }
  }

  @Patch('reset-photo/:id')
  @IsConnected()
  public resetPhoto(@Param('id') id: string): Promise<UpdateResult> {
    return this.userAccountService.resetPhoto(+id);
  }

  @Delete(':id')
  @IsConnected()
  public remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.userAccountService.remove(+id);
  }
}
