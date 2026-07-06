#!/usr/bin/env bash
# exit on error
set -o errexit

echo ">>> Downloading yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o yt-dlp
chmod +x yt-dlp

echo ">>> Downloading ffmpeg static build..."
curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz -o ffmpeg.tar.xz
mkdir -p ffmpeg-temp
tar -xJvf ffmpeg.tar.xz -C ffmpeg-temp --strip-components=1
mv ffmpeg-temp/ffmpeg .
mv ffmpeg-temp/ffprobe .
rm -rf ffmpeg-temp ffmpeg.tar.xz

echo ">>> Installing Deno for yt-dlp JavaScript extraction..."
curl -fsSL https://deno.land/install.sh | DENO_INSTALL=./.deno sh

echo ">>> Installing Node dependencies..."
npm install

echo ">>> Rebuilding sqlite3 from source to fix GLIBC issues..."
npm rebuild sqlite3 --build-from-source

echo ">>> Building TypeScript project..."
npm run build

echo ">>> Writing YouTube cookies from environment variable if available..."
if [ -n "$YOUTUBE_COOKIES" ]; then
  echo "$YOUTUBE_COOKIES" > cookies.txt
  echo "    cookies.txt written from YOUTUBE_COOKIES env var ($(wc -l < cookies.txt) lines)"
else
  echo "    YOUTUBE_COOKIES env var not set, using committed cookies.txt"
fi

echo ">>> Build completed successfully!"
