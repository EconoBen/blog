# LinkedIn Post: TTS Blog Feature

🎙️ Just shipped a new feature for my blog: automatic text-to-speech for every post!

Built a complete pipeline that:
• Extracts text from Markdown, removing code blocks and formatting
• Uses NLP to expand contractions ("I've" → "I have") for natural speech
• Intelligently chunks long posts at paragraph/sentence boundaries
• Generates audio via OpenAI's TTS API
• Concatenates chunks seamlessly with FFmpeg
• Hosts on AWS S3 for global distribution

The coolest part? It's fully automated. Write post → run build → audio appears. No manual recording needed.

Tech stack: Node.js, OpenAI TTS, AWS S3, React, FFmpeg

Every post now has a sleek audio player with speed controls (1x-2x), progress bar, and time display. Making content more accessible, one post at a time.

Check out the implementation details: https://labasc.blog/posts/adding-text-to-speech-to-your-blog-openai-tts-pipeline

#WebDevelopment #OpenAI #AWS #React #Accessibility #TechBlog #TextToSpeech