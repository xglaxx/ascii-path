import { spawn } from "child_process";
export default ((output, { fps, path }) => {
   return spawn("ffmpeg", [
      "-f", "image2pipe",
      "-vcodec", "png",
      "-r", String(fps),
      "-i", "-",
      "-i", path,              // Entrada 1: Arquivo original (para o áudio)
      "-map", "0:v:0",         // Pega vídeo da entrada 0
      "-map", "1:a:0",         // Pega áudio da entrada 1
      "-c:v", "libx264",
      "-preset", "ultrafast",
      "-c:a", "aac",           // Recodifica o áudio para garantir compatibilidade
      "-pix_fmt", "yuv420p",
      "-shortest",
      "-y", output
   ]); // extrair os frames do vídeo  
});