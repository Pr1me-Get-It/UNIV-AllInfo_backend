import multer from "multer";
import mime from "mime-types";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dest = path.join(__dirname, "..", "services", "auth", "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dest),
  filename: (req, file, cb) => cb(null, `${file.originalname}`),
});
const upload = multer({ storage: storage });

const uploadMiddleware = upload.single("file");

export default uploadMiddleware;
