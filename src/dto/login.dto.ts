import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';


export class LoginDto {
  @ApiProperty()
  name_user: string;
  @ApiProperty()
  password: string;
}

export class RegisterDto {
  @ApiProperty()
  @IsNotEmpty()
  name_user: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEmail()
  email_user: string;

  @ApiProperty()
  roles: RoleDto[];
}


export class RoleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  id: string;
}