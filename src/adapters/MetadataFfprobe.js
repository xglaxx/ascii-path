import { exec } from "child_process";
export default (async (file) => {
   return new Promise((resolve, reject) => {
      exec(`ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=width,height,duration,r_frame_rate,nb_read_packets -of json "${file}"`, (err, stdout, stderr) => {
         if (err) reject(new Error(err));
         
         const json = JSON.parse(stdout);
         const [stream] = json.streams;
         const frames = parseInt(Number(stream.nb_read_packets));
         const [num, den] = stream.r_frame_rate.split("/");
         resolve({
            seconds: Number(`${stream.duration.trim().includes('.') ? stream.duration.trim().split('.')[0] : stream.duration.trim()}`),
            fps: (Number(num) / Number(den)),
            frames,
            width: stream.width,
            height: stream.height
         });
      });
   });
});