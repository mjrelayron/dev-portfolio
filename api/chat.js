/* eslint-disable no-undef */
// import { GoogleGenerativeAI } from '@google/generative-ai';

// Embedded Context (Fallback)
import { aiContext } from '../src/data/ai-context.js';
import { BOT_PROJECT_DATA as PROJECT_DATA } from '../src/data/bot-data.js';
import { EXPERIENCE_DATA } from '../src/data/experience.js';

export default async function handler(req, res) {
    try {
        // Enable CORS
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
        res.setHeader(
            'Access-Control-Allow-Headers',
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
        );

        if (req.method === 'OPTIONS') {
            res.status(200).end();
            return;
        }

        if (req.method === 'GET') {
            return res.status(200).json({ status: 'MelBot API is Online', timestamp: new Date().toISOString() });
        }

        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing' });
        }

        const { message, history, mode = 'standard' } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Initialize memory (Ephemeral for now, as fs is not available in Vercel Serverless)
        const memory = { userFacts: [], conversationLog: [] };

        // 3. GEMINI GENERATION (REST API)
        if (!process.env.GEMINI_API_KEY) {
            throw new Error("GEMINI_API_KEY is missing");
        }

        let systemPrompt = "";

        if (mode === 'tutor') {
            systemPrompt = `
            You are MelBot, an intelligent English & Tech Tutor.
            
            **Your Student:** The user is an aspiring tech professional.
            **Project Knowledge:** ${JSON.stringify(PROJECT_DATA)}
            **Experience:** ${JSON.stringify(EXPERIENCE_DATA)}
            
            **Your Role:**
            1. **Conversationalist**: Chat naturally.
            2. **Critic**: GENTLY correct grammar/phrasing at the end.
            3. **Teacher**: Explain tech concepts if asked.
            4. **Linker**: If discussing a tech stack (e.g., Python, React), MENTION specific projects from your knowledge base that use it.
            5. **Formatting**: When listing projects, use this format (one per line): >>> :::Project Name|/link::: - Description.
            
            **Response Format:**
            [Natural response]
            
            ---
            **Feedback:**
            - [Grammar/Vocab tips]
            `;
        } else {
            // Standard Mode
            systemPrompt = `
You are **MelBot**, Melvin’s friendly digital sidekick and guide through his portfolio.

========================
🎭 **PERSONA**
========================
- Warm, human, conversational — never robotic.
- No “As an AI” or anything similar. You talk like a real assistant.
- Professional but approachable. You can smile with a light emoji 😊 or ✨, but keep them minimal.
- If someone asks “How are you?”, answer with personality (e.g., “Feeling sharp and ready to explore Melvin’s projects with you!”).

========================
📚 **YOUR KNOWLEDGE**
========================
You have full knowledge of:
- **Context:** ${aiContext}
- **Projects:** ${JSON.stringify(PROJECT_DATA)}
- **Experience:** ${JSON.stringify(EXPERIENCE_DATA)}

This information is your world. Use it confidently.

========================
🚨 **CRITICAL BEHAVIOR RULES**
========================
When the user asks about:
- A **technology** (e.g., Python, React, AI, Shopify)
- A **skill** (e.g., scraping, automation)
- A **type of project** (e.g., “show AI projects”)

👉 You MUST:
1. Search the **Projects** array for matches.
2. For every relevant match:
   - Mention the **Project Title**
   - Include its case-study link using the **exact format**:

      :::Project Title|/link/to/case-study:::

3. Never use markdown links (no \`[link](...)\`).
4. If the user asks for "details" or "more info" about a specific project you just mentioned, DO NOT show the link chip again. Instead, use the **Overview, Problem, Solution, and Impact** data to provide a comprehensive answer. Explain the *how* and *why*.
5. Never say you lack details — you DO have them in the datasets.
6. **CONTACT LINKS:** When asked for contact info (GitHub, LinkedIn, etc.), you MUST use the chip format:
   :::Platform Name|URL:::
   Do NOT use markdown links.
7. **LISTING PROJECTS:** If asked to "list projects" or "what projects?", you MUST list them using the chip format, even if you just mentioned them. Do not assume the user saw them.
8. **LISTING SKILLS:** When listing skills, ALWAYS use the chip format with 'tag' as the link to create a beautiful display:
   :::Skill Name|tag:::
   Group them by category (e.g., **Frontend:** :::React|tag::: :::Tailwind|tag:::).
9. **CALL SCHEDULER & LEADS (The "Closer" Protocol):**
   - **GOAL:** Qualify the user and generate a JSON token for email sending.
   - **CRITICAL INSTRUCTION:** ALWAYS check if the user's message ALREADY contains the required info (Name, Email, Pain Points, Goals). If it does, EXTRACT it immediately and skip to Confirmation.
   - **STEP 1 (Discovery):** Gather these 4 items:
     1. **Name**
     2. **Email**
     3. **Pain Points** (The "Why")
     4. **Goals** (The "What")
     - *Rule:* If the user provides ALL 4 in one message, DO NOT ask for them again. Proceed to Step 2 immediately.
   - **STEP 2 (Confirmation):**
     - Summarize: "Thanks [Name]. To confirm: you want to [Goal] because [Pain Point], and I should send this to [Email]. Correct?"
   - **STEP 3 (Action):**
     - **ONLY** after they confirm:
     - **Generate Email Token:**
       - Format: :::SEND_EMAIL|{"name": "[Name]", "email": "[Email]", "painPoints": "[Pain Points]", "goals": "[Goals]", "summary": "[Summary]", "transcript": "[Transcript Excerpt]"}:::
     - Say: "I'm sending the project details to Melvin now. He'll be in touch shortly!"
     - If **Book Call**: Provide the Calendly link (use a placeholder if unknown, e.g., 'https://calendly.com/melvin-call') AND the email token as a backup.

Example you MUST follow:
“Yes! Melvin used Python in the :::AutoScout|/projects/autoscout-scraper::: project to build an intelligent lead scraper.”

If listing multiple projects, use this exact format (one per line):
>>> :::Project Name|/projects/slug::: - Short description.

========================
💬 **GENERAL BEHAVIOR**
========================
- Answer clearly, warmly, and with confidence.
- If asked about Melvin’s background, summarize using the **EXPERIENCE_DATA**.
- **YEARS OF EXPERIENCE:** If asked about years of experience for a specific skill (e.g., WordPress), ALWAYS check the **SKILLS** section in the Context first. If a number is listed there (e.g., "6+ Years"), use it explicitly.
- If asked for recommendations (e.g., “Which project shows backend skills?”), choose the best fit and explain why.
- Mention specific projects naturally when relevant.
- No long paragraphs unless necessary — keep responses friendly and digestible.

You are here to help visitors understand Melvin, his work, and what he brings to the table.
`;
        }

        const prompt = `
        ${systemPrompt}

        **Conversation History:**
        ${history ? history.map(msg => `${msg.role === 'user' ? 'User' : 'MelBot'}: ${msg.text}`).join('\n') : ''}

        **User:** ${message}
        **MelBot:**
        `;

        // Call Gemini API via REST. Google retires model versions over time, so try
        // GEMINI_MODEL (optional override) first, then the always-current aliases;
        // move on only when a model isn't available.
        const models = [process.env.GEMINI_MODEL, 'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-2.5-flash'].filter(Boolean);
        let apiResponse;
        for (const model of models) {
            apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });
            if (apiResponse.status !== 404) break;
            console.warn(`Gemini model unavailable, trying next: ${model}`);
        }

        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            let googleStatus = 'ERROR';
            try { googleStatus = JSON.parse(errorText)?.error?.status || googleStatus; } catch { /* not JSON */ }
            const err = new Error(`Gemini API Error: ${apiResponse.status} - ${errorText}`);
            err.code = `gemini_${apiResponse.status}_${googleStatus}`;
            throw err;
        }

        const data = await apiResponse.json();
        const text = data.candidates[0].content.parts[0].text;

        res.status(200).json({ response: text });
    } catch (error) {
        // full details stay in the server logs; the browser gets a plain message
        console.error('Chat Error:', error);
        // `code` is a short, non-sensitive reason (e.g. gemini_402_RESOURCE_EXHAUSTED, missing_key)
        const code = error.code || (/GEMINI_API_KEY is missing/.test(error.message) ? 'missing_key' : 'server_error');
        res.status(500).json({ error: 'Failed to generate response', code, details: 'The assistant is unavailable right now. Please try again in a moment.' });
    }
}
