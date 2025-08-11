import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserAccountDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(60)
  password: string;
}
