import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: faker.internet.userName(),
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  password: string;

  @ApiProperty({
    example: faker.internet.userName(),
  })
  @IsString()
  username: string;
}

export class LoginDto {
  @ApiProperty({
    example: faker.internet.userName(),
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'password',
  })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}
