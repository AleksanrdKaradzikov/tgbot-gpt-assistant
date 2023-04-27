import axios from "axios";
import { createWriteStream } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import ffmpeg from "fluent-ffmpeg";
import instaler from "@ffmpeg-installer/ffmpeg";

import { removeFile } from "./utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

class OggConventor {
    constructor() {
        ffmpeg.setFfmpegPath(instaler.path);
    }

    toMp3(input, output) {
        try {
            const outputPath = resolve(dirname(input), `${output}.mp3`);

            return new Promise((resolve, reject) => {
                ffmpeg(input)
                    .inputOption('-t 30')
                    .output(outputPath)
                    .on('end', () => {
                        removeFile(input);
                        resolve(outputPath);
                    })
                    .on('error', () => reject(err.message))
                    .run();
            });
        } catch (err) {
            console.log('Error while creating mp3');
        }
    }

    async create(url, filename) {
        try {
            const oggPath = resolve(__dirname, '../voices', `${filename}.ogg`);
            const response = await axios.get(url, {
                method: 'get',
                responseType: 'stream',
            });

            return new Promise((resolve) => {
                const stream = createWriteStream(oggPath);
                response.data.pipe(stream);
                stream.on('finish', () => resolve(oggPath));
            });
        } catch (err) {
            console.log('Error while creating ogg', err.message);
        }
    }
}

export const ogg = new OggConventor();
