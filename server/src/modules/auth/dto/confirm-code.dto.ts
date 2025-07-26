import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConfirmCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  verification_code: string;
}
