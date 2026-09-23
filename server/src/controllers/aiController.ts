import { Request, Response } from "express";
import OpenAI from 'openai'
import z from "zod";
import { db } from "../db/db.js";
import { articulations } from "../db/schema.js";
import { eq } from "drizzle-orm";

const promptSchema = z.object({
    raw_text: z.string().min(6, 'prompt must be at least 6 characters long').max(2000, 'prompt must be at max 2000 characters long'),
    tone: z.string()
})

export const aiTextConverter = async(req: Request, res: Response) => {
    try {
        const result = promptSchema.safeParse(req.body);
        if (!result.success) { return res.status(400).json({ message: "Validation failed", errors: result.error.flatten(), }); }
        const {raw_text, tone} = result.data;
    // const { raw_text, tone } = req.body;
        const user = req.user;
        
    if (user) {
        const client = new OpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: process.env.GROQ_API_KEY
    })

    const response = await client.chat.completions.create({
        model: 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: `I want you to convert my raw text(i don't know to articulate):${raw_text}
            to a well articulated and eloquent version i want the tone to be ${tone}` }]
    })

    const content = response.choices[0].message.content;
    
    if (!content) {
    throw new Error("AI returned no content");
    }

    // in V2, i'll make the title Ai generated
    const title = raw_text.length > 50
    ? raw_text.slice(0, 50) + "..."
    : raw_text;

    const [articulation] = await db.insert(articulations).values({
        userId: user.id,
        title: title,
    rawText: raw_text,
    tone: tone,
    result: content
    }).returning();

    console.log(response.choices[0].message.content)

    res.status(200).json({Generated_result: response.choices[0].message.content, articulation: articulation});
    }else{
        res.status(401).json({message: "this user is not authenticated/authorised to call this"})
    }

    
    } catch (error) {
        res.status(500).json({message: "something went wrong", error: error})
    }

}

export const getArticulations = async (req:Request, res: Response) => {
    const user = req.user;
    if (!user) {
        return res.status(403).json({message: "user doesnt exist to make this call!!"})
    }
    const [articulation] = await db.select().from(articulations).where(eq(user.id, user.id));
    if (!articulation) {
      return res.status(403).json({message: "sorry could not get the user articulations, something went wrong"});  
    }
    return res.status(200).json({articulation:articulation})
}

//Docs guide:
// const client = new OpenAI({
//   baseURL: 'https://api.groq.com/openai/v1',
//   apiKey: process.env.GROQ_API_KEY
// })

// const response = await client.chat.completions.create({
//   model: 'openai/gpt-oss-120b',
//   messages: [{ role: 'user', content: 'Explain closures in one paragraph.' }]
// })

// console.log(response.choices[0].message.content)

// The SDK automatically uses process.env.GEMINI_API_KEY
// const ai = new GoogleGenAI();

// app.post('/api/chat', async (req, res) => {
//   try {
//     const { prompt } = req.body;

//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: prompt,
//     });

//     res.json({ text: response.text });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to communicate with Gemini' });
//   }
// });

// app.listen(3000, () => console.log('Backend running on port 3000'));