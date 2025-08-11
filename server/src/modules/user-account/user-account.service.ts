import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserAccountDto } from './dto/create-user-account.dto';
import { UpdateUserAccountDto } from './dto/update-user-account.dto';
import { UserAccount } from './entities/user-account.entity';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly configService: ConfigService,
  ) {}

  public async create(createUserAccountDto: CreateUserAccountDto, photo?: MemoryStorageFile): Promise<UserAccount> {
    const user_account = await this.userAccountRepository.save({
      ...createUserAccountDto,
      photo: this.configService.get<string>('defaultPhoto'),
    });
    if (photo) {
      const ext = photo.mimetype.split('/')[1];
      await this.userAccountRepository.update(user_account.id, { photo: `${user_account.id}.${ext}` });
      const uploadPath = path.join(__dirname, `../../../upload/user-account`, `${user_account.id}.${ext}`);
      fs.writeFileSync(uploadPath, photo.buffer);
    }
    return user_account;
  }

  public async findForLogin(email: string): Promise<UserAccount | null> {
    const user = await this.userAccountRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return user;
  }

  public async verificationCodeIsValid(email: string, verification_code: string): Promise<boolean> {
    // Récupérer l'utilisateur avec le code de vérification
    const user = await this.userAccountRepository.findOne({
      where: { email, verification_code },
      select: ['verification_date'],
    });

    if (!user) return false;
    const verificationDate = new Date(user.verification_date);
    const currentTime = new Date();
    const timeDifference = (currentTime.getTime() - verificationDate.getTime()) / 1000 / 60;
    if (timeDifference <= 200) {
      return true;
    }
    return false;
  }

  public findByEmail(email: string): Promise<UserAccount> {
    return this.userAccountRepository.findOne({ where: { email } });
  }

  public async findOne(id: number): Promise<UserAccount> {
    const userInfo = await this.userAccountRepository.findOne({
      where: { id },
      relations: ['backgrounds', 'search_bars', 'links', 'preset_backgrounds', 'preset_links', 'preset_search_bars'],
    });
    delete userInfo.password;
    return userInfo;
  }

  public async updateVerificationCode(id: number, verification_code: string): Promise<UpdateResult> {
    return this.userAccountRepository.update(id, { verification_code, verification_date: new Date().toISOString() });
  }

  public async update(id: number, updateUserAccountDto: UpdateUserAccountDto, photo?: MemoryStorageFile): Promise<UpdateResult> {
    if (photo) {
      // Récupérer l'utilisateur actuel pour gérer l'ancienne photo
      const user_account = await this.userAccountRepository.findOne({ where: { id } });
      if (user_account?.photo) {
        const oldPhotoPath = path.join(__dirname, `../../../upload/user-account`, user_account.photo);
        if (fs.existsSync(oldPhotoPath) && !user_account.photo.startsWith('default')) {
          fs.unlinkSync(oldPhotoPath);
        }
      }

      // Sauvegarder la nouvelle photo
      const ext = photo.mimetype.split('/')[1];
      const uploadPath = path.join(__dirname, `../../../upload/user-account`, `${id}.${ext}`);
      fs.writeFileSync(uploadPath, photo.buffer);

      // Ajouter le nom de fichier au DTO
      (updateUserAccountDto as UpdateUserAccountDto & { photo?: string }).photo = `${id}.${ext}`;
    }

    return this.userAccountRepository.update(id, updateUserAccountDto);
  }

  public async resetPhoto(id: number): Promise<UpdateResult> {
    const user_account = await this.userAccountRepository.findOne({ where: { id }, relations: ['client', 'admin', 'veterinarian'] });
    if (user_account?.photo) {
      const oldPhotoPath = path.join(__dirname, `../../../upload/user-account`, user_account.photo);
      if (fs.existsSync(oldPhotoPath) && !user_account.photo.startsWith('default')) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    let photo = this.configService.get<string>('defaultPhoto');
    return this.userAccountRepository.update(id, { photo });
  }

  public async remove(id: number): Promise<DeleteResult> {
    const user_account = await this.userAccountRepository.findOne({ where: { id } });
    const oldPhotoPath = path.join(__dirname, `../../../upload/user-account`, user_account.photo);
    if (fs.existsSync(oldPhotoPath) && !user_account.photo.startsWith('default')) {
      fs.unlinkSync(oldPhotoPath);
    }
    return this.userAccountRepository.delete(id);
  }

  public async updatePartial(id: number, field: string, value: unknown): Promise<UpdateResult> {
    return await this.userAccountRepository.update(id, { [field]: value });
  }
}
