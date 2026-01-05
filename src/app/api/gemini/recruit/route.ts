import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  if (!apiKey) {
    return NextResponse.json(
      { 
        mode: "spark", 
        motivation: "API Key is missing. Defaulting to Spark mode. Let's start small!", 
        isMock: true 
      },
      { status: 200 }
    );
  }

  try {
    const { task } = await req.json();

    if (!task) {
      return NextResponse.json({ error: "Task is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Analyze the following task complexity and recommend a focus mode.
    Task: "${task}"
    
    Modes:
    - spark: Quick tasks, emails, admin work (25 min)
    - deepDive: Coding, writing, complex problem solving (50 min)
    - peakFlow: Learning new concepts, architecture design, deep research (90 min)
    
    Return ONLY a JSON object with this format (no markdown):
    {
      "mode": "spark" | "deepDive" | "peakFlow",
      "motivation": "A short, punchy 1-sentence motivation specifically for this task."
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up markdown if Gemini sends it
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const data = JSON.parse(cleanText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { 
        mode: "deepDive", 
        motivation: "Let's dive deep into this anyway. You got this!",
        error: "AI service temporarily unavailable"
      },
      { status: 200 } // Fallback success
    );
  }
}
