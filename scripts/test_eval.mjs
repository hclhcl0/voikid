import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load .env.local
const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
const apiKey = envConfig.GEMINI_API_KEY;

console.log('Testing with API key:', apiKey.slice(0, 8) + '...');

const wavBuffer = fs.readFileSync('scripts/dog.wav');
const base64Audio = wavBuffer.toString('base64');
const mimeType = 'audio/wav';

const genAI = new GoogleGenerativeAI(apiKey);

// Test model list / availability
async function test() {
  const modelName = 'gemini-1.5-flash';
  console.log(`Testing model: ${modelName}`);
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: { responseMimeType: 'application/json' }
  });

  const promptA = `You transcribe a short English speech recording. The speaker may be a child learning English. You are not given an expected answer.
Listen to the audio. Return only the fields defined by the response schema.
Set speechStatus to clear only if the spoken words can be transcribed adequately.
Use unclear when speech exists but cannot be transcribed adequately.
Use no_speech only when no spoken response is audible, with transcript null.
Set interference to suspected when overlapping speech makes response ambiguous, otherwise none_detected.
Return a JSON object with:
{
  "speechStatus": "clear" | "unclear" | "no_speech",
  "transcript": string | null,
  "interference": "none_detected" | "suspected"
}`;

  try {
    const resA = await model.generateContent([
      { inlineData: { data: base64Audio, mimeType } },
      { text: promptA }
    ]);
    console.log('--- Branch A response ---');
    console.log(resA.response.text());
  } catch (err) {
    console.error('Branch A failed:', err.message);
  }

  // Branch B with target "dog"
  const promptB_dog = `You assess a recording of a child reading English text.
Lesson data: ${JSON.stringify({ targetText: 'dog', acceptedResponses: ['dog', 'a dog', 'the dog'] })}

Return a JSON object with:
{
  "assessability": "usable" | "uncertain" | "unusable",
  "contentMatch": "match" | "partial" | "different" | "uncertain",
  "pronunciation": "acceptable" | "needs_practice" | "uncertain" | "not_applicable",
  "issues": [],
  "rawModelScore": null
}`;

  try {
    const resB = await model.generateContent([
      { inlineData: { data: base64Audio, mimeType } },
      { text: promptB_dog }
    ]);
    console.log('--- Branch B (target dog) response ---');
    console.log(resB.response.text());
  } catch (err) {
    console.error('Branch B dog failed:', err.message);
  }

  // Branch B with target "cat"
  const promptB_cat = `You assess a recording of a child reading English text.
Lesson data: ${JSON.stringify({ targetText: 'cat', acceptedResponses: ['cat', 'a cat', 'the cat'] })}

Return a JSON object with:
{
  "assessability": "usable" | "uncertain" | "unusable",
  "contentMatch": "match" | "partial" | "different" | "uncertain",
  "pronunciation": "acceptable" | "needs_practice" | "uncertain" | "not_applicable",
  "issues": [],
  "rawModelScore": null
}`;

  try {
    const resB_cat = await model.generateContent([
      { inlineData: { data: base64Audio, mimeType } },
      { text: promptB_cat }
    ]);
    console.log('--- Branch B (target cat) response ---');
    console.log(resB_cat.response.text());
  } catch (err) {
    console.error('Branch B cat failed:', err.message);
  }
}

test();
