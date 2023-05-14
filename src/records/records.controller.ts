import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RecordsBody } from './dto/records.dto';
import { RecordsService } from './records.service';
import { RecordsEntity } from './entities/records.entity';
import { Request } from 'express';
import { RecordsInterceptor } from './interceptors/records.interceptor';
import { diskStorage } from 'multer';
import { FileInterceptorOptions } from './interceptors/file-interceptor.options';

@ApiBearerAuth()
@ApiTags('Records')
@Controller('records')
export class RecordsController {
  constructor(private recordService: RecordsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new record' })
  @UseInterceptors(new RecordsInterceptor())
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(FileInterceptorOptions),
      limits: { fileSize: 20971520 }, //20 MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(RecordsBody)
  async createRecord(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Req() req: Request,
  ): Promise<RecordsEntity> {
    return this.recordService.createRecord(file, body, req);
  }

  @Get()
  @ApiOperation({ summary: 'Get records by pages' })
  async getRecords(@Query('page') page: number): Promise<RecordsEntity[]> {
    return await this.recordService.getRecords(page);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update record' })
  @UseInterceptors(new RecordsInterceptor())
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage(FileInterceptorOptions),
      limits: { fileSize: 20971520 }, //20 MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody(RecordsBody)
  async updateRecord(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Req() req: Request,
    @Param('id') recordId: string,
  ) {
    return this.recordService.updateRecord(file, body, req, recordId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete record' })
  async deleteRecord(
    @Param('id') recordId: string,
    @Req() req,
  ): Promise<string> {
    return this.recordService.deleteRecord(recordId, req);
  }
}
