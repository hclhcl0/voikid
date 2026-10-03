import fs from 'fs';
import { evaluatePronunciation } from '../src/lib/gemini.ts';

const audioBuffer = fs.readFileSync('d:/engl/vocakids/scripts/dog.wav');
const audioBase64 = audioBuffer.toString('base64');
const apiKey = process.env.GEMINI_API_KEY || '';

async function run() {
  console.log('--- Testing audio: "dog.wav", target: "Cat" ---');
  try {
    const result = await evaluatePronunciation(audioBase64, 'audio/wav', 'Cat', 'Con mèo', apiKey);
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
