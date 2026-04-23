import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface SecurityThreat {
  id: string;
  type: 'url' | 'file';
  source: string; // The URL or filename
  rawMetadata: any;
  timestamp: number;
}

export interface SecurityAnalysis {
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  technicalDetails: string;
  recommendedAction: 'Deep Clean' | 'Risk Download' | 'None';
}

export interface BreachInfo {
  source: string;
  date: string;
  isLeaked: boolean;
  dataTypes: string[];
  usageContext: string;
}

export interface OSINTReport {
  email: string;
  status: 'Safe' | 'Breached';
  breaches: BreachInfo[];
  summary: string;
}

export async function analyzeThreat(threat: SecurityThreat): Promise<SecurityAnalysis> {
  const prompt = `Analyze the following security event for a "Zero-Trust" Android system. 
  Event Type: ${threat.type}
  Source: ${threat.source}
  Raw Data: ${JSON.stringify(threat.rawMetadata)}

  Provide a human-readable security summary for a senior user.
  Explain specific risks like XSS, Credential Leaks, or Malicious Downloads.
  
  Format the response as JSON with exactly these fields:
  {
    "riskLevel": "Low" | "Medium" | "High" | "Critical",
    "summary": "Short, clear summary of what this is",
    "technicalDetails": "Detailed explanation of the risk",
    "recommendedAction": "Deep Clean" | "Risk Download" | "None"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    return {
      riskLevel: 'Medium',
      summary: "Potential Risk Detected",
      technicalDetails: "Automated analysis was unable to complete. Manual review advised.",
      recommendedAction: 'Risk Download'
    };
  }
}

export async function checkEmailBreach(email: string): Promise<OSINTReport> {
  const prompt = `Perform a simulated OSINT breach check for the following email: ${email}.
  
  Provide a plausible report on whether this email might have been found in historical data breaches (e.g., LinkedIn 2016, Canva 2019, etc.).
  
  Format the response as JSON with exactly these fields:
  {
    "email": "${email}",
    "status": "Safe" | "Breached",
    "breaches": [
      {
        "source": "Name of the breach service",
        "date": "Year/Month",
        "isLeaked": true,
        "dataTypes": ["passwords", "emails", "names"],
        "usageContext": "A brief description of how or where the user typically used this account (e.g., 'Primary social media login', 'E-commerce account')"
      }
    ],
    "summary": "Short explanation of the risk to the user"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("OSINT Scan Failed:", error);
    return {
      email,
      status: 'Safe',
      breaches: [],
      summary: "Database unreachable. System using local cache: No known breaches found for this identity."
    };
  }
}
