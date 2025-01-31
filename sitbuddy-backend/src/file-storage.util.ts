import { diskStorage } from 'multer';
import { extname } from 'path';

export function createFileStorageConfig(destination: string) {
  return diskStorage({
    destination: destination,
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  });
}
