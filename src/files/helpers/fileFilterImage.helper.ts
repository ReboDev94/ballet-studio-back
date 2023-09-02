import { BadRequestException } from '@nestjs/common';

export const fileFilterImage = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  if (!file) return callback(new BadRequestException('file is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const VALID_EXTENSION = ['jpg', 'jpeg', 'png'];

  if (!VALID_EXTENSION.includes(fileExtension)) {
    return callback(new BadRequestException('file is not support'), false);
  }

  return callback(null, true);
};
