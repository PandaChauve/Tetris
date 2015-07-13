ffmpeg -i "rewrap.mp4" -r 20 -filter:v "setpts=0.5*PTS" -codec:v libx264 -profile:v baseline -pix_fmt yuv420p -movflags +faststart -crf 30 -preset veryslow fast.mp4

-f image2  -i "2015-07-11_%%08d.png" -r 60