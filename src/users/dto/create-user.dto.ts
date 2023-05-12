import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsString } from 'class-validator';

export class CreateUserDto {
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
