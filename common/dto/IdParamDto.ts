import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';

export class IdParamDto {
  @ApiProperty({
    example: faker.datatype.uuid(),
  })
  @IsUUID()
  id: string;
}
