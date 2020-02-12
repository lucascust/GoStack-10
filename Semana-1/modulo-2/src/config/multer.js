import multer from 'multer';
import crypto from 'crypto';
// extname informa a extensão do arquivo,
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // callback: (16)hex.ext "41C2A31F2A1E.png"

        return cb(null, res.toString('hex') + extname(file.originalname))
      });
    },
  }),
};

