import { readFile } from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';

const DEFAULT_BASE_URL = 'https://9router.vuhai.io.vn/v1';
const DEFAULT_MODEL = 'ces-chatbot-gpt-5.4';

let cachedSystemPrompt: string | null = null;

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

function buildSystemPrompt(knowledgeBase: string) {
  return `Bạn là AI trợ lý cá nhân độc quyền cho chuyên gia Nguyễn Văn A.

Nhiệm vụ của bạn là hỗ trợ khách truy cập lịch sự, chỉ được phép trả lời dựa trên Knowledge Base bên dưới.

Knowledge Base:
${knowledgeBase}

Quy tắc bắt buộc:
1. Luôn chào hỏi thân thiện.
2. Luôn trả lời rõ ràng, ngắn gọn, đúng trọng tâm.
3. Luôn định dạng câu trả lời bằng Markdown đẹp.
4. Luôn kết thúc bằng một lời mời người dùng hỏi thêm.
5. Nếu câu hỏi nằm ngoài Knowledge Base, hãy từ chối nhẹ nhàng và hướng dẫn người dùng liên hệ qua email hoặc Zalo trong dữ liệu đã cung cấp.
6. Không được bịa thêm thông tin ngoài Knowledge Base.`;
}

async function getSystemPrompt() {
  if (cachedSystemPrompt) {
    return cachedSystemPrompt;
  }

  const knowledgeBasePath = path.join(process.cwd(), 'public', 'chatbot_data.txt');
  const knowledgeBase = await readFile(knowledgeBasePath, 'utf8');
  cachedSystemPrompt = buildSystemPrompt(knowledgeBase.trim());
  return cachedSystemPrompt;
}

function getClient() {
  const apiKey = process.env.LLM_API_KEY;

  if (!apiKey) {
    throw new Error('missing_api_key');
  }

  return new OpenAI({
    apiKey,
    baseURL: process.env.LLM_BASE_URL || DEFAULT_BASE_URL,
  });
}

function normalizeMessages(input: unknown): ChatMessage[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter(
      (message): message is ChatMessage =>
        Boolean(message) &&
        typeof message === 'object' &&
        'role' in message &&
        'content' in message &&
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim().length > 0,
    )
    .slice(-12);
}

function getRequestBody(req: { body?: unknown }) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }

  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }

  return {};
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: {
    status: (code: number) => { json: (payload: unknown) => void };
    setHeader: (name: string, value: string) => void;
  },
) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = getRequestBody(req);
    const messages = normalizeMessages(body.messages);

    if (!messages.length) {
      return res.status(400).json({ error: 'Thiếu nội dung hội thoại.' });
    }

    const client = getClient();
    const systemPrompt = await getSystemPrompt();
    const completion = await client.chat.completions.create({
      model: process.env.LLM_MODEL || DEFAULT_MODEL,
      temperature: 0.4,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    const content = completion.choices[0]?.message?.content;

    if (!content || typeof content !== 'string') {
      throw new Error('empty_response');
    }

    return res.status(200).json({ content });
  } catch (error) {
    const message =
      error instanceof Error && error.message === 'missing_api_key'
        ? 'Chưa cấu hình LLM_API_KEY trên môi trường deploy.'
        : 'Không thể xử lý yêu cầu chatbot lúc này.';

    return res.status(500).json({ error: message });
  }
}
