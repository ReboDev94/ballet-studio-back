import { InternalServerErrorException } from '@nestjs/common';

export const fileFilterImage = (
  req: Express.Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/ban-types
  callback: Function,
) => {
  if (!file)
    return callback(new InternalServerErrorException('file is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const VALID_EXTENSION = ['jpg', 'jpeg', 'png', 'gif'];

  if (VALID_EXTENSION.includes(fileExtension)) {
    return callback(null, true);
  }

  return callback(null, false);
};
