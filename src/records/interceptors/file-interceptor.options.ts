import { DiskStorageOptions } from 'multer';
import { Request } from 'express';
import { randomUUID } from 'crypto';

export const FileInterceptorOptions: DiskStorageOptions = {
  destination: `${process.cwd()}/src/uploads`,
  filename(
    req: Request,
    file: Express.Multer.File,
    callback: (error: Error | null, filename: string) => void,
  ) {
    const [type, format] = file.mimetype.split('/');
    file.originalname = `${randomUUID()}.${format}`;
    file.destination = `${process.cwd()}/src/uploads`;
    callback(null, file.originalname);
  },
};
