ffmpeg -f image2  -i "2015-08-04_%%08d.png" -r 15 -filter:v "setpts=1*PTS" -codec:v libx264 -profile:v baseline -pix_fmt yuv420p -movflags +faststart -crf 30 -preset veryslow fast.mp4

