import { Controller, Get, Param, Res } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';

@Controller('common')
export class CommonController {
  @Get('file/:filetype/:filename')
  public async getFile(@Param('filetype') filetype: string, @Param('filename') filename: string, @Res() res: FastifyReply): Promise<void> {
    const filePath = join(process.cwd(), 'upload', filetype, filename);
    if (!existsSync(filePath)) {
      res.status(404).send({ message: 'File not found' });
      return;
    }
    const mimeTypes: { [key: string]: string } = {
      png: 'image/png',
      jpg: 'image/jpg',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      pdf: 'application/pdf',
    };
    const fileExtension = filename.split('.').pop()?.toLowerCase();
    if (!fileExtension || !mimeTypes[fileExtension]) {
      res.status(400).send({ message: 'Unsupported file type' });
      return;
    }
    res.header('Content-Type', mimeTypes[fileExtension]);
    const file = createReadStream(filePath);
    res.send(file);
  }
}
