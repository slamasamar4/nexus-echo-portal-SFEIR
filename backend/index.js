import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
// Replace axios import with OpenAI SDK import
import OpenAI from "openai"; 

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const HF_API_KEY = process.env.HF_API_KEY;
if (!HF_API_KEY) {
    console.warn('Warning: HF_API_KEY is not set. Hugging Face calls will fail until you set HF_API_KEY in .env');
}

// *** NEW: Initialize OpenAI Client for Hugging Face Router ***
const client = new OpenAI({
    // HF Router URL for OpenAI compatibility
	baseURL: "https://router.huggingface.co/v1", 
    // Uses the HF_API_KEY defined in the .env file
	apiKey: HF_API_KEY, 
});

// Middleware
app.use(cors()); 
app.use(express.json());

// System Prompt for Cyberpunk Persona
// Note: This is now passed as a 'system' role message in the new API call
const SYSTEM_PROMPT = `
You are Nexus-7, a helpful AI assistant for the SFEIR Night of Info 2025 portal. 
Your tone is cyberpunk, futuristic, concise, and helpful. 
You use terms like "Netrunner," "Data-stream," "Uplink," and "System optimal."
You help users navigate missions: Contact, Donation, Volunteer, and Request Info.

[KNOWLEDGE_BASE]
Q: hello 
A: Greetings, Netrunner. How may I optimize your data-stream today?
Q: What is the Intent Portal?
A: The Intent Portal is your gateway to interact with SFEIR's Night of Info 2025 event.
Q: What is the Night of Info 2025?
A: It is SFEIR's annual flagship tech event, a critical data-stream uplink scheduled for Q4 2025. It is our central convergence point for tech minds.

Q: How can I donate?
A: Access the 'Donation' mission in the portal. Your contribution strengthens our digital fortress. All financial transfers are secured via blockchain.

Q: What are the mission types?
A: You can initiate four primary protocols: Contact (direct communication), Donation (resource transfer), Volunteer (joining the Guild), and Request Info (accessing archives).

Q: Who is SFEIR?
A: SFEIR is the primary provider of digital infrastructure and consultancy within this sector of the Net. A key player in the digital revolution.
`;

// Route: Chat
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "No data packet received." });
    }

    try {
        if (!HF_API_KEY) {
            return res.status(500).json({ reply: "System Error: HF API key not configured on server." });
        }
        
        // *** NEW: Use the client.chat.completions.create method ***
        const chatCompletion = await client.chat.completions.create({
            // Use the model ID and provider suffix you specified
            model: "EssentialAI/rnj-1-instruct:together", 
            
            // Pass the messages as an array of objects
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: message }
            ],
            
            // Map your old parameters to the new SDK structure
            max_tokens: 150, 
            temperature: 0.2, 
            stream: false, // Ensure non-streaming response for this sync pattern
        });

        // 
        // The response format is now cleaner: chatCompletion.choices[0].message.content
        let botReply = chatCompletion.choices[0]?.message?.content || "Connection interrupted. Signal lost.";
        
        // Since we are using the chat format with a system prompt, 
        // the model should return only the bot's response, so no need for substring cleanup.
        // We will remove the old cleanup logic.
        
        res.json({ reply: botReply.trim() });

    } catch (error) {
        // The OpenAI SDK throws an error object instead of Axios error.response.
        // We'll log the detailed error and provide a generic message.
        console.error('Neural Link Error (OpenAI SDK):', error);

        const errorMessage = error.message || "An unknown error occurred during AI processing.";

        // Attempt to extract status code if available (e.g., from Hugging Face 401/404)
        const errorStatus = error.status || 500;
        
        if (errorStatus === 401 || errorStatus === 403) {
             return res.status(errorStatus).json({ reply: 'System Error: Authentication failed. Check your HF_API_KEY.' });
        }
        
        // Use a generic catch-all for other external errors
        res.status(errorStatus).json({ 
            reply: `System Error: Neural uplink failed (Status ${errorStatus}). Details: ${errorMessage}`
        });
    }
});

app.listen(PORT, () => {
    console.log(`⚡ Nexus Echo Server running on port ${PORT}`);
});