import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserAccountDto } from './dto/create-user_account.dto';
import { UpdateUserAccountDto } from './dto/update-user_account.dto';
import { UserAccount } from './entities/user_account.entity';
import { UserAccountWithHomeSettings } from './models/query-response.model';

@Injectable()
export class UserAccountService {
  constructor(
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
    private readonly configService: ConfigService,
  ) {}

  public async create(createUserAccountDto: CreateUserAccountDto): Promise<UserAccount> {
    return this.userAccountRepository.save(createUserAccountDto);
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

  public async findOne(id: number): Promise<UserAccountWithHomeSettings> {
    const user = await this.userAccountRepository.findOne({ select: ['id', 'email', 'photo', 'created_at', 'password'], where: { id } });
    if (!user) return null;
    user.photo = 'localhost:3500/common/file/user_account/' + user.photo;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResult } = user;
    const result: UserAccountWithHomeSettings = {
      userAccount: userResult,
      homeSettings: {
        backgroundImageUrl:
          'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fflurry-jagged-angular-shapes-digital-art-illustration_783299-1110.jpg&f=1&nofb=1&ipt=4886857085cca3a202adc41b81ea845782e97060f832e2f0c8f32b446682d62c',
      },
    };
    return result;
  }

  public async updateVerificationCode(id: number, verification_code: string): Promise<UpdateResult> {
    return this.userAccountRepository.update(id, { verification_code, verification_date: new Date().toISOString() });
  }

  public async updatePhoto(id: number, photo: MemoryStorageFile): Promise<UpdateResult> {
    const user_account = await this.userAccountRepository.findOne({ where: { id } });
    if (user_account?.photo) {
      const oldPhotoPath = path.join(__dirname, `../../../upload/user_account`, user_account.photo);
      if (fs.existsSync(oldPhotoPath) && !user_account.photo.startsWith('default')) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    const ext = photo.mimetype.split('/')[1];
    const uploadPath = path.join(__dirname, `../../../upload/user_account`, `${id}.${ext}`);
    fs.writeFileSync(uploadPath, photo.buffer);
    return this.userAccountRepository.update(id, { photo: `${id}.${ext}` });
  }

  public async update(id: number, updateUserAccountDto: UpdateUserAccountDto): Promise<UpdateResult> {
    return this.userAccountRepository.update(id, updateUserAccountDto);
  }

  public async resetPhoto(id: number): Promise<UpdateResult> {
    const user_account = await this.userAccountRepository.findOne({ where: { id }, relations: ['client', 'admin', 'veterinarian'] });
    if (user_account?.photo) {
      const oldPhotoPath = path.join(__dirname, `../../../upload/user_account`, user_account.photo);
      if (fs.existsSync(oldPhotoPath) && !user_account.photo.startsWith('default')) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    let photo = this.configService.get<string>('user_account.defaultPhoto');
    return this.userAccountRepository.update(id, { photo });
  }

  public async remove(id: number): Promise<DeleteResult> {
    const user_account = await this.userAccountRepository.findOne({ where: { id } });
    const oldPhotoPath = path.join(__dirname, `../../../upload/user_account`, user_account.photo);
    if (fs.existsSync(oldPhotoPath) && !user_account.photo.startsWith('default')) {
      fs.unlinkSync(oldPhotoPath);
    }
    return this.userAccountRepository.delete(id);
  }

  public async updatePartial(id: number, field: string, value: unknown): Promise<UpdateResult> {
    return await this.userAccountRepository.update(id, { [field]: value });
  }
}
