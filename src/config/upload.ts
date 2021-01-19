import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

export default {
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, '..', '..', 'tmp'),
        filename(req, file, cb) {
            const fileHash = crypto.randomBytes(10).toString('hex');

            const fileName = `${fileHash}-${file.originalname}`;

            return cb(null, fileName);
        },
    }),
};
