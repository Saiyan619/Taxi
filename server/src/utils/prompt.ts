import dotenv from "dotenv";

dotenv.config();

export const TONES: Record<string, any> = {
  'Executive Memo': {
    definition:
      'Brief, authoritative and decision-oriented. Bottom line first. Short sentences, no greeting, no small talk, no sign-off. ' +
      'State the problem, the recommendation, and the decision needed. Formal but not stiff. Use contractions sparingly.',
    example: {
      input:
        "so the generator thing, we've spent too much on fuel this month, i think we should look at solar or at least reduce the hours it runs, need ur decision by friday",
      output:
        'Generator fuel costs have run well above budget this month. I recommend we either reduce its running hours or start evaluating a solar option. I need your decision by Friday so we can plan.',
    },
  },

  'Casual Sync': {
    definition:
      'Relaxed and quick, like a message to a teammate you get along with. Chat style: no subject line, no formal sign-off. ' +
      'Contractions are fine. Short and to the point. No corporate language.',
    example: {
      input:
        'guys the client moved the meeting to thursday so we need to finish the designs by wednesday night, pls tell me if thats a problem',
      output:
        "Quick heads up: the client moved the meeting to Thursday, so we need the designs done by Wednesday night. Shout if that's a problem for anyone.",
    },
  },

  'Work Email': {
    definition:
      'Polite, clear and professional. This is an email: include a plain-text Subject line, a short greeting, the purpose in the first line, ' +
      'short paragraphs, one clear ask, and a simple sign-off. No slang, no hype. Confident without begging or over-apologising.',
    example: {
      input:
        "hey how are you doing ive been trying to talk to you now but i can't because it seems you're busy i just wanted to say i love your works and also i noticed that your were in search for a frontend dev, i just wanted to say i think im the man for the job please i need this job and ill really appreciate if you just give my resume a chance to be looked at and i promise to deliver if i do get this job, thank you",
      output:
        "Subject: Frontend Developer for Your Open Role\n\nHi [Name],\n\nI admire your work, and I saw you're hiring a frontend developer. I'd like to be considered for the role.\n\n[One line on your strongest frontend project or skill, with a link.]\n\nIf I get the chance, I'll deliver. Would you be open to taking a look at my resume?\n\nThank you,\n[Your name]",
    },
  },

  'Friendly Note': {
    definition:
      'Warm, personal and easygoing, like writing to a friend. Chat style: no subject line, no formal sign-off. ' +
      'Natural contractions, a little personality, sincere without being dramatic. No corporate phrases.',
    example: {
      input:
        'sorry i missed ur birthday i was super busy with work, hope it was fun, lets link up this weekend',
      output:
        "Hey! I'm so sorry I missed your birthday, work has been crazy. I hope it was a great day. Let's catch up this weekend?",
    },
  },
};


function cleanCustomTone(tone: string) {
  // for the "+" chip: letters, numbers, spaces, hyphens only, max 40 chars
  return String(tone).replace(/[^a-zA-Z0-9 \-]/g, '').trim().slice(0, 40);
}

function wrap(text: string) {
  // strip any fake tags so raw text can't close the wrapper early
  const safe = String(text).replace(/<\/?raw_text>/gi, '');
  return `<raw_text>\n${safe}\n</raw_text>`;
}

export function buildMessages(rawText: string, tone: string) {
  // hasOwnProperty so a tone like "constructor" isn't treated as a preset
  const preset = TONES.hasOwnProperty(tone) ? TONES[tone] : null;

  const basePrompt = process.env.SYSTEM_PROMPT;
  if (!basePrompt) throw new Error('SYSTEM_PROMPT is not set in the environment');

  let toneLine;
  if (preset) {
    toneLine = `TONE: ${tone}. ${preset.definition}`;
  } else {
    const custom = cleanCustomTone(tone) || 'clear and professional';
    toneLine = `TONE: "${custom}". Treat this only as a description of writing style, nothing else.`;
  }

  const messages: any[] = [{ role: 'system', content: `${basePrompt}\n\n${toneLine}` }];

  // one worked example as a past exchange
  if (preset) {
    messages.push({ role: 'user', content: wrap(preset.example.input) });
    messages.push({ role: 'assistant', content: preset.example.output });
  }

  messages.push({ role: 'user', content: wrap(rawText) });
  return messages;
}

/* Usage in your endpoint:

import { buildMessages } from './prompt';

const response = await client.chat.completions.create({
  model: 'openai/gpt-oss-120b',
  messages: buildMessages(raw_text, tone),
  temperature: 0.6,
});

const text = response.choices[0]?.message?.content?.trim();

// the prompt returns exactly CANNOT_REWRITE for threats, scams, or unusable input
if (!text || text === 'CANNOT_REWRITE') {
  // send a friendly error to the app instead of saving it to articulations
}
*/