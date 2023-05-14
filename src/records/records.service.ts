import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecordsEntity } from './entities/records.entity';
import { randomUUID } from 'crypto';
import { unlink } from 'node:fs/promises';
import { RecordsMessages } from './messages/records.messages';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(RecordsEntity)
    private recordRepository: Repository<RecordsEntity>,
  ) {}

  async createRecord(file, body, req): Promise<RecordsEntity> {
    const fileName = file
      ? `${file?.destination}/${file?.originalname}`
      : undefined;

    const record = this.recordRepository.create({
      id: randomUUID(),
      fileName: fileName,
      message: body.message || null,
      authorId: req.author.sub,
    });

    return this.recordRepository.save(record);
  }

  async getRecords(offset: number): Promise<RecordsEntity[]> {
    const limit = 20;
    offset = (offset - 1) * limit;
    if (offset < 0) {
      throw new BadRequestException(RecordsMessages.PAGE_ERROR);
    }
    return this.recordRepository
      .createQueryBuilder('record')
      .leftJoin('record.author', 'author')
      .select([
        'record.id',
        'record.message',
        'record.fileName',
        'record.createdAt',
        'record.updatedAt',
        'author.username',
      ])
      .orderBy('record.createdAt')
      .where('record.deleted = false')
      .skip(offset)
      .take(limit)
      .getMany();
  }

  async updateRecord(file, body, req, recordId): Promise<RecordsEntity> {
    const record = await this.getRecordById(recordId);
    if (req.author.sub !== record.authorId) {
      throw new ForbiddenException(RecordsMessages.RECORD_OWNERSHIP_ERROR);
    }

    let fileName = record.fileName;
    if (file) {
      fileName = `${file?.destination}/${file?.originalname}`;
      record.fileName ? await unlink(record.fileName) : false;
    }

    let message = record.message;
    if (body.message && body.message.trim() !== '') {
      message = body.message;
    }

    await this.recordRepository.update({ id: recordId }, { fileName, message });

    return await this.getRecordById(recordId);
  }

  async deleteRecord(recordId: string, req): Promise<string> {
    const record = await this.getRecordById(recordId);
    if (req.author.sub !== record.authorId) {
      throw new ForbiddenException(RecordsMessages.RECORD_OWNERSHIP_ERROR);
    }
    await this.recordRepository.update(recordId, { deleted: true });
    record.fileName ? await unlink(record.fileName) : false;
    return RecordsMessages.SUCCESSFULLY_DELETED_RECORD;
  }

  private async getRecordById(id: string): Promise<RecordsEntity> {
    try {
      return await this.recordRepository.findOneOrFail({
        where: { id, deleted: false },
      });
    } catch (error) {
      throw new NotFoundException(RecordsMessages.RECORD_NOT_FOUND);
    }
  }
}
