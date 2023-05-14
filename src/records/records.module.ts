import { Module } from '@nestjs/common';
import { RecordsController } from './records.controller';
import { RecordsService } from './records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordsEntity } from './entities/records.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecordsEntity])],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
