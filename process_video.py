import os
import subprocess
import json

def process_video():
    source = 'cinematic_source.mp4'
    output_dir = 'public/assets/sequence'

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    # ffmpeg command to extract frames
    # -vf scale=-1:720 (720p height, keep aspect ratio)
    # -r 30 (30 fps)
    command = [
        'ffmpeg',
        '-i', source,
        '-vf', 'scale=-1:720',
        '-r', '30',
        '-c:v', 'libwebp',
        '-lossless', '0',
        '-compression_level', '4',
        '-q:v', '75',
        f'{output_dir}/frame_%04d.webp'
    ]

    print(f"Running ffmpeg command: {' '.join(command)}")
    subprocess.run(command, check=True)

    # Count the generated frames
    frames = [f for f in os.listdir(output_dir) if f.endswith('.webp')]
    frame_count = len(frames)

    print(f"Generated {frame_count} frames.")

    # Generate frames.json
    metadata = {
        'totalFrames': frame_count,
        'format': 'webp',
        'width': 1280,  # Assuming standard 16:9 720p, width is 1280
        'height': 720,
        'fps': 30
    }

    with open(f'{output_dir}/frames.json', 'w') as f:
        json.dump(metadata, f, indent=2)

    print("Generated frames.json")

if __name__ == '__main__':
    process_video()
