import { FileFieldsInterceptor, MemoryStorageFile, UploadedFiles } from '@blazity/nest-file-fastify';
import { BadRequestException, Body, ConflictException, Controller, Post, Request, Response, UseGuards, UseInterceptors } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { CustomRequest } from 'src/common/models/request.model';
import { MailService } from '../../common/services/mail.service';
import { UserAccountService } from '../user_account/user_account.service';
import { AuthService } from './auth.service';
import { ConfirmCodeDto } from './dto/confirm-code.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userAccountService: UserAccountService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(@Request() req: CustomRequest, @Response({ passthrough: true }) res: FastifyReply): Promise<{ message: string }> {
    const { access_token } = await this.authService.login(req.user);
    return res
      .setCookie('Authorization', `Bearer ${access_token}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      })
      .code(200)
      .send({ message: 'Login successful', token: access_token });
  }

  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photo', maxCount: 1 }], { limits: { fileSize: 50 * 1024 * 1024 } }))
  public async register(
    @Response({ passthrough: true }) res: FastifyReply,
    @Body() user: RegisterDto,
    @UploadedFiles() files?: { photo?: MemoryStorageFile[] },
  ): Promise<{ message: string }> {
    if (!user.email || !user.password) {
      throw new BadRequestException('Missing required fields');
    }
    if (await this.userAccountService.findByEmail(user.email)) {
      throw new ConflictException('Email already used');
    }
    const { id } = await this.authService.register(user.email, user.password);
    if (files?.photo && files.photo[0] && files.photo[0].buffer.length > 0) {
      // Traiter et sauvegarder le fichier
      await this.userAccountService.updatePhoto(id, files.photo[0]);
    }
    const { access_token } = await this.authService.login({
      id,
      email: user.email,
    });
    return res
      .setCookie('Authorization', `Bearer ${access_token}`, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      })
      .code(200)
      .send({ message: 'Login successful', token: access_token });
  }

  @Post('confirm-code')
  public async confirmCode(@Body() confirmCodeDto: ConfirmCodeDto): Promise<boolean> {
    return await this.userAccountService.verificationCodeIsValid(confirmCodeDto.email, confirmCodeDto.verification_code);
  }

  @Post('send-code')
  public async sendCode(@Body() body: { email: string }): Promise<{ message: string }> {
    const user = await this.userAccountService.findByEmail(body.email);
    if (!user) throw new BadRequestException('User not found');
    const verification_code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userAccountService.updateVerificationCode(user.id, verification_code);
    await this.mailService.confirmEmail(body.email, verification_code);
    return { message: 'Code sent' };
  }
}
