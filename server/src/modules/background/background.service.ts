import { MemoryStorageFile } from '@blazity/nest-file-fastify';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserAccount } from '../user-account/entities/user-account.entity';
import { CreateBackgroundDto } from './dto/create-background.dto';
import { UpdateBackgroundDto } from './dto/update-background.dto';
import { Background } from './entities/background.entity';

@Injectable()
export class BackgroundService {
  constructor(
    @InjectRepository(Background)
    private readonly backgroundRepository: Repository<Background>,
    @InjectRepository(UserAccount)
    private readonly userAccountRepository: Repository<UserAccount>,
  ) {}

  public async create(userId: number, createBackgroundDto: CreateBackgroundDto, image?: MemoryStorageFile): Promise<Background> {
    const userAccount = await this.userAccountRepository.findOne({ where: { id: userId } });
    if (!userAccount) {
      throw new Error('User not found');
    }

    const background = await this.backgroundRepository.save({
      ...createBackgroundDto,
      user_account: userAccount,
      image: 'default-background.jpg', // default value
    });

    if (image) {
      const ext = image.mimetype.split('/')[1];
      const fileName = `${background.id_background}.${ext}`;
      await this.backgroundRepository.update(background.id_background, { image: fileName });

      const uploadPath = path.join(__dirname, `../../../upload/background`, fileName);
      if (!fs.existsSync(path.dirname(uploadPath))) {
        fs.mkdirSync(path.dirname(uploadPath), { recursive: true });
      }
      fs.writeFileSync(uploadPath, image.buffer);
    }

    return background;
  }

  public async findByUserAccount(userId: number): Promise<Background[]> {
    return this.backgroundRepository.find({
      where: { user_account: { id: userId } },
      relations: ['user_account'],
    });
  }

  public async update(id: number, updateBackgroundDto: UpdateBackgroundDto, image?: MemoryStorageFile): Promise<UpdateResult> {
    const background = await this.backgroundRepository.findOne({ where: { id_background: id } });
    if (!background) {
      throw new Error('Background not found');
    }

    if (image) {
      // Delete old image if exists
      if (background.image && !background.image.startsWith('default')) {
        const oldImagePath = path.join(__dirname, `../../../upload/background`, background.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image
      const ext = image.mimetype.split('/')[1];
      const fileName = `${id}.${ext}`;
      const uploadPath = path.join(__dirname, `../../../upload/background`, fileName);
      fs.writeFileSync(uploadPath, image.buffer);

      updateBackgroundDto.image = fileName;
    }

    return this.backgroundRepository.update(id, updateBackgroundDto);
  }

  public async remove(id: number): Promise<DeleteResult> {
    const background = await this.backgroundRepository.findOne({ where: { id_background: id } });
    if (background?.image && !background.image.startsWith('default')) {
      const imagePath = path.join(__dirname, `../../../upload/background`, background.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    return this.backgroundRepository.delete(id);
  }
}
