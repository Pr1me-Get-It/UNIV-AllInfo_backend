import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ocrScriptPath = path.join(__dirname, "ocrService.py");

const runOcrService = async (userId) => {
  return new Promise((resolve, reject) => {
    const process = spawn("python", [ocrScriptPath, "--userId", userId]);
    let output = "";

    process.stdout.on("data", (data) => {
      output += data.toString();
    });
    process.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });
    process.on("close", (code) => {
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          resolve(result);
        } catch (error) {
          reject(new Error(`Failed to parse OCR output: ${error.message}`));
        }
      } else {
        reject(new Error(`OCR service exited with code ${code}`));
      }
    });
  });
};

export default runOcrService;
