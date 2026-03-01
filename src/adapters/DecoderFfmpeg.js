import { spawn } from "child_process";
export default ((path, { width, height }) => {
   return spawn("ffmpeg", [
      "-i", path,
      "-f", "rawvideo",
      "-vf", `scale=${width}:${height}`,
      "-pix_fmt", "rgb24",
      "-"
   ]); // extrair os frames do vídeo  
});