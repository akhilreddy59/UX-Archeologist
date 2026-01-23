import { GoogleGenAI } from "@google/genai";
import { ArcheologyReport, Solution, TimelineEvent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:video/mp4;base64,")
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Phase 1: Analysis
 * Uses Gemini 3 Flash for high-speed video processing.
 * Thinking Level: Minimal (Optimization).
 */
export const analyzeVideo = async (videoFile: File): Promise<ArcheologyReport> => {
  const videoBase64 = await fileToGenerativePart(videoFile);
  const mimeType = videoFile.type;

  const prompt = `
    You are the "UX Archeologist". Analyze this screen recording of a web application bug frame-by-frame.
    
    1. Identify the flow of events.
    2. Pinpoint the EXACT timestamp where the UI logic diverges from expected behavior (the bug).
    3. Look for visual cues like console errors (if visible), unhandled loading states, or missing feedback.
    
    Output strictly in JSON format with the following schema:
    {
      "events": [
        { "timestamp": "00:01", "action": "User clicks login", "observation": "Button state changes", "isError": false }
      ],
      "summary": "A concise summary of the bug found.",
      "thoughtSignature": "A detailed technical description of the visual state and potential causality to be passed to a logic engine."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: mimeType, data: videoBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        // Thinking budget 0 disables thinking for speed/token savings on the visual pass
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as ArcheologyReport;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze video. Ensure the video is short (<1 min) and supported format.");
  }
};

/**
 * Phase 2: Reasoning & Solution
 * Uses Gemini 3 Pro for deep logic and code generation.
 * Thinking Level: High (Deep Reasoning).
 */
export const generateSolution = async (report: ArcheologyReport): Promise<Solution> => {
  const prompt = `
    You are a Senior Software Engineer and Test Automation Specialist.
    
    INPUT CONTEXT (Thought Signature from Visual Analysis):
    "${report.thoughtSignature}"
    
    BUG SUMMARY:
    "${report.summary}"
    
    TIMELINE:
    ${JSON.stringify(report.events, null, 2)}
    
    TASKS:
    1. Write a distinct, robust Playwright test script (TypeScript) that reproduces this specific bug. It should fail exactly as described.
    2. Write a suggested Code Fix for a typical React/Next.js component that would solve this issue.
    3. Explain the root cause briefly.
    
    Output strictly in JSON format:
    {
      "playwrightScript": "full code string...",
      "suggestedFix": "full code string...",
      "explanation": "text..."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        // High thinking budget for complex code generation and causality reasoning
        thinkingConfig: { thinkingBudget: 2048 } 
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as Solution;
  } catch (error) {
    console.error("Solution generation failed:", error);
    throw new Error("Failed to generate solution.");
  }
};