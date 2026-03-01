#!/usr/bin/env node
/*
   × Antes de tudo, instale essas dependências:
      pkg install nodejs
      npm install pureimage
   × Fontes recomendadas para monoespaçada:
      Courier Prime;
      JetBrains Mono;
      Fira Code;
   × Recomendo baixar as fontes no GoogleFont:
      https://fonts.google.com/
*/
import path from "path";
import Ascii from "./index.js";
import { fileURLToPath } from "url";
const _fileName = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_fileName);
const pross = process.argv;
const input = (pross[2] || path.join(_dirname, "tmp/test/", "video_test.mp4"));
const output = (pross[3] || "");

(async () => {
   const ascii = new Ascii({
      dir: _dirname, // diretório onde vai os arquivos: Output & FontDir
      fontSize: 20, // Tamanho da fonte; (Padrão 12)
      colorChars: true, // Colorir os Pixels; (OPCIONAL)
      path: input, // Arquivo Entrada; (OBRIGATÓRIO!!!) >>> PNG / JPEG / JPG / MP4
      output: output, // Arquivo Saída, apenas o nome do arquivo; (OBRIGATÓRIO) 
      //scale: 0, // Alterar a escala da largura e altura de pixel; (OPCIONAL)
      //chars: "", // Caracteres especiais para o pixel; (OPCIONAL)
      //colorFont: "white", // Escolher a cor do caracteres, só se estiver "colorChars: false"; (OPCIONAL)
      //colorBackground: "black", // Cor do fundo; (OPCIONAL)
      //font: "./fonts/Courier.ttf", // Recomendo que tenha monoespaçada; (Se não tiver a fonte, pode executar "selectFont" ou ver a lista de fontes disponíveis)
      //fontName: "Courier" // Dar o nome para a fonte que vai ser usada; (OPCIONAL)
      //fontDir: "fonts/", // Carregar todas as fontes apenas direcionando a pasta; (OPCIONAL) ¦ O diretório já é agregado com Dir
   });
   //console.log("Lista de Chars:", ascii.listChars);
   //ascii.chars = "math";
   //console.log("Lista de Fontes:", Object.values(ascii.listFonts())); // Ver as fonts disponíveis;
   ascii.selectFont("CourierPrime-Regular"); // Use se caso NÃO TENHA A FONTE PARA DIRECIONAR!!! (OBRIGATÓRIO!!!)
   ascii.ev.on("ascii.start", (data) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`× Largura: ${data.width} ¦ Altura: ${data.height} ¦ Frames: ${data.frames} ¦ FPS: ${data.fps} `);
   });
   ascii.ev.on("ascii.frame", (data) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`× Time: ${data.time} ¦ Frames: ${data.frame}/${data.frameTotal} ¦ SizeBytes: ${data.sizeBytes} ¦ Speed: ${data.speed}x ¦ Percent: ${data.percent}% `);
   });
   ascii.ev.on("ascii.complete", (data) => {
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(data);
   });
   try {
      await ascii.start();
   } catch (error) {
      console.error(error)
   }
   process.exit();
})();