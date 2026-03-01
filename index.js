import fs from "fs";
import path from "path";
import PImage from "pureimage";
import EventEmitter from 'events';
import { pipeline } from "stream";
import { Writable, Transform } from "stream";
import Adapters from "./src/adapters/index.js";
import Functions from "./src/functions/index.js";
import ConfigMetadata from "./src/ports/ConfigMetadata.js";
export default class Ascii extends ConfigMetadata {
   constructor(data) {
      super(data);
      this.ev = new EventEmitter();
   }
   
   listFonts(diretoryFonts = "./source/Fonts/") {
      const ListFontsPast = fs.readdirSync(diretoryFonts); 
      const pastFont = { all: [] };
      const openPastByFont = (dir, arr) => {
         var index = 0;
         for (const p of fs.readdirSync(dir)) {
            if (p.endsWith(".ttf")) {
               arr.push({
                  index,
                  local: dir,
                  font: p,
                  name: path.basename(p, ".ttf")
               });
               index++;
            } else {
               if (!(p in pastFont)) pastFont[p] = [];
               
               index = 0;
               const openListFonts = dir+p+"/";
               for (const f of fs.readdirSync(openListFonts)) {
                  if (f.endsWith(".ttf")) {
                     pastFont[p].push({
                        index,
                        local: openListFonts,
                        font: f,
                        name: path.basename(f, ".ttf")
                     });
                     index++;
                  } else {
                     const pass = pastFont[p+"-"+f] = [];
                     openPastByFont(openListFonts+f+"/", pass);
                  }
               }
            }
         }
      };
      openPastByFont(diretoryFonts, pastFont.all);
      return pastFont;
   }
   
   selectFont(name) {
      let select;
      const listPast = this.listFonts();
      for (const p in listPast) {
         for (const v of listPast[p]) {
            if (v.name === name || v.font === name || v.index === name) {
               select = v;
            }
            if (select) break;
         }
      }
      if (select) {
         this.changeFont(select.local+select.font, select.name);
      }
      return select;
   }
   
   changeFont(diretoryFont, nameFont) {
      this.fontName = Adapters.ChangeFont(diretoryFont, nameFont, PImage);
   }
   
   async asciiToVideo() {
      return Adapters.MetadataFfprobe(this.path).then(({ fps, frames, width, height }) => {
         const frameSize = ((width * height) * 3);
         const decoder = Adapters.DecoderFfmpeg(this.path, { width, height }); // Abrir o arquivo e extrair os frames
         const encoder = Adapters.EncoderFfmpeg(this.output, { fps, path: this.path }); // Renderizar o arquivo e editar
         const frameToAscii = (frame) => Adapters.Ascii(PImage, { frame, width, height }, this).img;
         const AsciiRenderer = new Transform({
            transform(chunk, encoding, callback) {
               this.internalBuffer = Buffer.concat([this.internalBuffer || Buffer.alloc(0), chunk]);
               const processNextFrame = async () => {
                  if (this.internalBuffer.length >= frameSize) {
                     const rawFrame = this.internalBuffer.subarray(0, frameSize);
                     this.internalBuffer = this.internalBuffer.subarray(frameSize);
                     const chunks = [];
                     const img = frameToAscii(rawFrame);
                     const bufferStream = new Writable({
                        write(c, enc, cb) {
                           chunks.push(c);
                           cb();
                        }
                     });
                     bufferStream.on("finish", () => {
                        this.push(Buffer.concat(chunks));
                        processNextFrame();
                     });
                     await PImage.encodePNGToStream(img, bufferStream);
                  } else {
                     callback();
                  }
               };
               processNextFrame();
            }
         });
         return new Promise(async (resolve, reject) => {
            decoder.on('error', (error) => {
               this.ev.emit("ascii.error", error);
               reject({ tag: "decoder", error });
            });
            encoder.on('error', (error) => {
               this.ev.emit("ascii.error", error);
               reject({ tag: "encoder", error });
            });
            decoder.on("close", (code) => {
               if (code === 0) {
                  this.ev.emit("decoder.waiting", "Decoder finalizou. Aguardando processamento dos frames restantes...");
               }
            });
            encoder.on("exit", (code) => {
               if (code === 0) {
                  this.ev.emit("ascii.complete", this.output);
                  resolve(this.output);
               } else {
                  this.ev.emit("encoder.exit", "O Encoder fechou com erro. O vídeo pode estar corrompido.");
                  reject({ tag: "encoder", error: code });
               }
            });
            decoder.stderr.on("data", (data) => {
               let texto = data.toString("utf-8")?.trim();
               if (!texto) return;
               
               this.ev.emit("decoder.stderr", texto);
            });
            encoder.stderr.on("data", (data) => {
               let texto = data.toString("utf-8")?.trim();
               if (!texto) return;
               
               this.ev.emit("encoder.stderr", texto);
               texto = texto.split(/ +/).filter(v => v.length).join(" ");
               const [_f, frame] = (texto.match(/frame=\s*(\d+)/) || []); // Frames sendo adicionados;
               const [_s, size] = (texto.match(/size=\s*(\d+)/) || []); // Tamanho do arquivo;
               const [_t, time] = (texto.match(/time=*([0-9:]+)/) || []); // Tempo do vídeo carregado;
               const [_sp, speed] = (texto.match(/speed=*([0-9.]+)/) || []); // Velocidade de conversão;
               const [_e, elapsed] = (texto.match(/elapsed=*([0-9:]+)/) || []); // Duração de converter;
               if (time) {
                  this.ev.emit("ascii.frame", {
                     frame: this.isNumber(frame),
                     sizeBytes: this.isNumber(size),
                     time: String(time),
                     speed: this.isNumber(speed),
                     elapsed: String(elapsed),
                     frameTotal: frames,
                     percent: Functions.percent(frame, frames) 
                  });
               } else if (/ffmpeg/.test(texto)) {
                  this.ev.emit("ascii.start", { height, width, frames, fps });
               }
            });
            
            pipeline(decoder.stdout, AsciiRenderer, encoder.stdin, (err) => {
               if (err) {
                  if (err.code === 'ERR_STREAM_PREMATURE_CLOSE') {
                     this.ev.emit("ascii.pipeline-close", "Pipeline fechado (término esperado).");
                  } else {
                     this.ev.emit("ascii.pipeline-error", err);
                  }
               } else {
                  this.ev.emit("ascii.pipeline-complete", "Renderização concluída com sucesso!");
               }
            });
         });
       });
   }
   
   async asciiToImage() {
      return this.imageToAscii().then(({ img, ascii }) => {
         return new Promise(async (resolve, reject) => {
            let chunks = [];
            const bufferStream = new Writable({
               write(c, enc, cb) {
                  chunks.push(c);
                  cb();
               }
            });
            bufferStream.on("finish", () => {
               chunks = Buffer.concat(chunks);
               chunks = new Buffer.from(chunks.toString('base64'), 'base64');
               fs.writeFileSync(this.output, chunks);
               this.ev.emit("ascii.complete", this.output);
               resolve(this.output);
            });
            await PImage.encodePNGToStream(img, bufferStream);
         });
      });
   }
   
   async imageToAscii() {
      let originalImg;
      if (!fs.existsSync(this.path)) {
         throw new Error("Não existe nenhum arquivo apresentado!");
      } else if (this.path.endsWith('.png')) {
         originalImg = await PImage.decodePNGFromStream(fs.createReadStream(this.path));
      } else if (this.path.endsWith('.jpg') || this.path.endsWith('.jpeg')) {
         originalImg = await PImage.decodeJPEGFromStream(fs.createReadStream(this.path));
      } else {
         throw new Error("Formato de imagem não suportado (use PNG ou JPG)");
      }
      
      const { height, width } = originalImg;
      return Adapters.Ascii(PImage, { make: originalImg, width, height }, this);
   }
   
   start() {
      if (this.path.endsWith('.mp4')) {
         return this.asciiToVideo();
      } else {
         return this.asciiToImage();
      }
   }
   
}