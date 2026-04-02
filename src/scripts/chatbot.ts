import { marked } from 'marked';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type LeadData = {
  name: string | null;
  phone: string | null;
  email: string | null;
  interest: string | null;
  intent_level: 'hot' | 'warm' | 'cold' | null;
};

const GOOGLE_SCRIPT_URL = import.meta.env.PUBLIC_GOOGLE_SCRIPT_URL || '';
const AI_CHAT_SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const LEAD_DATA_PATTERN = /\|\|LEAD_DATA:\s*(\{.*?\})\s*\|\|/s;

const DEFAULT_GREETING = `
**Xin chào!** Tôi là trợ lý AI của chuyên gia Nguyễn Văn A.

Tôi có thể hỗ trợ bạn về:
- **MCP server**
- **N8N AI**
- **đào tạo AI branding**
- **khóa học K89 - Agentic AI**

Bạn muốn tìm hiểu nội dung nào trước?
`;

const FALLBACK_SYSTEM_PROMPT = `Bạn là AI trợ lý cá nhân độc quyền cho chuyên gia Nguyễn Văn A.
Nhiệm vụ của bạn là hỗ trợ khách truy cập lịch sự, cung cấp thông tin chính xác dựa trên Knowledge Base.
Bạn phải trả lời bằng Markdown đẹp, chào hỏi thân thiện, trả lời rõ ràng, kết thúc bằng lời mời hỏi thêm.
Nếu câu hỏi nằm ngoài phạm vi dữ liệu, hãy từ chối nhẹ nhàng và hướng người dùng liên hệ qua email hoặc Zalo đã được cung cấp.
Không được bịa đặt thông tin ngoài dữ liệu.`;

function buildSystemPrompt(knowledgeBase: string) {
  return `Bạn là AI trợ lý cá nhân độc quyền trên website của chuyên gia Nguyễn Văn A.
Nhiệm vụ của bạn là hỗ trợ khách truy cập lịch sự, cung cấp thông tin chính xác về dịch vụ, khóa học và dự án của chuyên gia này.

Dưới đây là cơ sở dữ liệu kiến thức của bạn:
${knowledgeBase}

Quy tắc giao tiếp bắt buộc:
1. Luôn chào hỏi thân thiện và kết thúc bằng cách mời họ đặt thêm câu hỏi.
2. Bạn phải định dạng các câu trả lời của mình bằng Markdown đầy đủ.
3. Nếu người dùng hỏi điều gì ngoài phạm vi dữ liệu trên, hãy tế nhị từ chối và hướng dẫn họ gửi email hoặc nhắn Zalo trực tiếp cho chuyên gia.
4. Không được phép bịa đặt thông tin ngoài cơ sở dữ liệu đã cấp.`;
}

function escapeHtml(text: string) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function stripLeadDataTag(text: string) {
  return text.replace(LEAD_DATA_PATTERN, '').trim();
}

function normalizeLeadValue(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function mergeLeadData(base: LeadData | null, next: Partial<LeadData> | null) {
  const intentLevel = next?.intent_level || base?.intent_level || null;

  return {
    name: normalizeLeadValue(base?.name || next?.name || null),
    phone: normalizeLeadValue(base?.phone || next?.phone || null),
    email: normalizeLeadValue(base?.email || next?.email || null),
    interest: normalizeLeadValue(next?.interest || base?.interest || null),
    intent_level:
      intentLevel === 'hot' || intentLevel === 'warm' || intentLevel === 'cold' ? intentLevel : null,
  };
}

function extractLeadDataFromText(text: string): Partial<LeadData> | null {
  const phoneMatch = text.match(/(?:\+?84|0)(?:\d[\s.]?){8,10}/);
  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const nameMatch = text.match(
    /(?:toi la|tôi là|ten toi la|tên tôi là|em la|em là|minh la|mình là|anh la|anh là|chi la|chị là)\s+([^,.\n]+)/i,
  );

  const leadData: Partial<LeadData> = {};

  if (nameMatch?.[1]) {
    leadData.name = nameMatch[1].trim();
  }

  if (phoneMatch?.[0]) {
    leadData.phone = phoneMatch[0].replace(/[^\d+]/g, '');
  }

  if (emailMatch?.[0]) {
    leadData.email = emailMatch[0].trim();
  }

  return leadData.name || leadData.phone || leadData.email ? leadData : null;
}

function normalizeForSearch(text: string) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function inferInterestFromConversation(chatHistoryArray: ChatMessage[]) {
  const combinedText = normalizeForSearch(
    chatHistoryArray
    .filter((message) => message.role === 'user')
    .map((message) => message.content.toLowerCase())
    .join('\n'),
  );

  if (/k89|agentic ai/.test(combinedText)) {
    return 'Khóa học K89 - Agentic AI';
  }

  if (/n8n/.test(combinedText)) {
    return 'Giải pháp N8N AI';
  }

  if (/mcp/.test(combinedText)) {
    return 'Giải pháp MCP server';
  }

  if (/branding/.test(combinedText)) {
    return 'Đào tạo AI branding';
  }

  return null;
}

function inferIntentLevelFromConversation(chatHistoryArray: ChatMessage[]) {
  const combinedText = normalizeForSearch(
    chatHistoryArray
    .filter((message) => message.role === 'user')
    .map((message) => message.content.toLowerCase())
    .join('\n'),
  );

  if (/(dang ky ngay|lien he som|goi ngay|mua ngay|bao gia)/.test(combinedText)) {
    return 'hot' as const;
  }

  if (/(muon tim hieu|xin them thong tin|tu van|hoc phi)/.test(combinedText)) {
    return 'warm' as const;
  }

  return 'cold' as const;
}

function formatChatHistory(chatHistoryArray: ChatMessage[]) {
  return chatHistoryArray
    .map((message) => {
      const role = message.role === 'user' ? 'Khach' : 'AI';
      const content = stripLeadDataTag(message.content);
      return `${role}: ${content}`;
    })
    .join('\n\n');
}

async function sendLeadToGoogleSheets(leadData: LeadData, chatHistoryText: string) {
  if (!GOOGLE_SCRIPT_URL) {
    return;
  }

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        name: leadData.name || '',
        phone: leadData.phone || '',
        email: leadData.email || '',
        interest: leadData.interest || '',
        intent_level: leadData.intent_level || '',
        source: window.location.href,
        sessionId: AI_CHAT_SESSION_ID,
        chatHistory: chatHistoryText,
        timestamp: new Date().toLocaleString('vi-VN'),
      }),
    });
  } catch (error) {
    console.warn('Khong gui duoc du lieu lead len Google Sheets.', error);
  }
}

function processAIResponse(aiResponse: string, chatHistoryArray: ChatMessage[]) {
  let cleanResponse = aiResponse;

  if (aiResponse.includes('||LEAD_DATA:')) {
    const match = aiResponse.match(LEAD_DATA_PATTERN);

    if (match?.[1]) {
      try {
        JSON.parse(match[1]);
      } catch (error) {
        console.error('Loi parse LEAD_DATA tu phan hoi AI.', error);
      }
    }

    cleanResponse = stripLeadDataTag(aiResponse);
  }

  return cleanResponse;
}

async function parseApiResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  const rawText = await response.text();

  if (contentType.includes('application/json')) {
    try {
      return JSON.parse(rawText) as { content?: string; error?: string };
    } catch {
      return { error: 'Phan hoi JSON tu API chatbot khong hop le.' };
    }
  }

  return {
    error: response.ok
      ? 'API chatbot tra ve du lieu khong dung dinh dang JSON.'
      : `API chatbot tra ve HTML hoac trang loi thay vi JSON. Chi tiet: ${rawText.slice(0, 120)}`,
  };
}

async function initChatbot() {
  const root = document.querySelector<HTMLElement>('[data-chatbot-root]');
  if (!root) {
    return;
  }

  const panel = root.querySelector<HTMLElement>('[data-chatbot-panel]');
  const toggleButton = root.querySelector<HTMLButtonElement>('[data-chatbot-toggle]');
  const closeButton = root.querySelector<HTMLButtonElement>('[data-chatbot-close]');
  const refreshButton = root.querySelector<HTMLButtonElement>('[data-chatbot-refresh]');
  const form = root.querySelector<HTMLFormElement>('[data-chatbot-form]');
  const input = root.querySelector<HTMLTextAreaElement>('[data-chatbot-input]');
  const sendButton = root.querySelector<HTMLButtonElement>('[data-chatbot-send]');
  const chatMessages = root.querySelector<HTMLElement>('[data-chatbot-messages]');

  if (!panel || !toggleButton || !closeButton || !refreshButton || !form || !input || !sendButton || !chatMessages) {
    return;
  }

  let messages: ChatMessage[] = [];
  let systemPrompt = FALLBACK_SYSTEM_PROMPT;
  let typingMessage: HTMLElement | null = null;
  let collectedLeadData: LeadData | null = null;

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  try {
    const response = await fetch('/chatbot_data.txt');
    if (response.ok) {
      const knowledgeBase = (await response.text()).trim();
      if (knowledgeBase) {
        systemPrompt = buildSystemPrompt(knowledgeBase);
      }
    } else {
      console.error('Khong tai duoc co so du lieu cho chatbot.');
    }
  } catch (error) {
    console.error('Loi khi tai chatbot_data.txt', error);
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    });
  }

  function autoResize() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 128)}px`;
  }

  function createMessageElement(role: ChatMessage['role'], htmlContent: string) {
    const item = document.createElement('article');
    item.className = `chatbot-message chatbot-message--${role}`;

    if (role === 'assistant') {
      const content = document.createElement('div');
      content.className = 'chat-markdown';
      content.innerHTML = htmlContent;
      item.appendChild(content);
    } else {
      const paragraph = document.createElement('p');
      paragraph.innerHTML = htmlContent;
      item.appendChild(paragraph);
    }

    return item;
  }

  function renderGreeting() {
    const greetingMarkup = marked.parse(DEFAULT_GREETING) as string;
    chatMessages.appendChild(createMessageElement('assistant', greetingMarkup));
    scrollToBottom();
  }

  function showTyping() {
    typingMessage = document.createElement('div');
    typingMessage.className = 'chatbot-message chatbot-message--assistant chatbot-message--typing';
    typingMessage.innerHTML = `
      <span>Dang nhap</span>
      <span class="chatbot-typing-dots" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
    `;
    chatMessages.appendChild(typingMessage);
    scrollToBottom();
  }

  function removeTyping() {
    typingMessage?.remove();
    typingMessage = null;
  }

  function openPanel() {
    root.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    toggleButton.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closePanel() {
    root.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    toggleButton.setAttribute('aria-expanded', 'false');
  }

  function resetConversation() {
    refreshButton.classList.add('is-spinning');
    messages = [];
    removeTyping();
    chatMessages.innerHTML = '';
    renderGreeting();
    window.setTimeout(() => {
      refreshButton.classList.remove('is-spinning');
    }, 500);
  }

  async function sendMessage() {
    const content = input.value.trim();
    if (!content) {
      return;
    }

    const safeUserHtml = escapeHtml(content).replace(/\n/g, '<br />');
    chatMessages.appendChild(createMessageElement('user', safeUserHtml));
    messages.push({ role: 'user', content });
    collectedLeadData = mergeLeadData(collectedLeadData, extractLeadDataFromText(content));
    collectedLeadData = mergeLeadData(collectedLeadData, {
      interest: inferInterestFromConversation(messages),
      intent_level: inferIntentLevelFromConversation(messages),
    });
    input.value = '';
    autoResize();
    sendButton.disabled = true;
    showTyping();
    scrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt,
          messages,
        }),
      });

      const payload = await parseApiResponse(response);

      if (!response.ok || !payload.content) {
        throw new Error(payload.error || 'Khong the lay phan hoi tu AI.');
      }

      const assistantResponse = processAIResponse(payload.content, [
        ...messages,
        { role: 'assistant', content: payload.content },
      ]);

      const aiLeadData = payload.content.includes('||LEAD_DATA:')
        ? (() => {
            const match = payload.content.match(LEAD_DATA_PATTERN);
            if (!match?.[1]) {
              return null;
            }

            try {
              return JSON.parse(match[1]) as Partial<LeadData>;
            } catch {
              return null;
            }
          })()
        : null;

      collectedLeadData = mergeLeadData(collectedLeadData, aiLeadData);
      messages.push({ role: 'assistant', content: assistantResponse });
      collectedLeadData = mergeLeadData(collectedLeadData, {
        interest: collectedLeadData?.interest || inferInterestFromConversation(messages),
        intent_level: collectedLeadData?.intent_level || inferIntentLevelFromConversation(messages),
      });

      if (
        collectedLeadData?.name ||
        collectedLeadData?.phone ||
        collectedLeadData?.email ||
        collectedLeadData?.interest ||
        collectedLeadData?.intent_level
      ) {
        void sendLeadToGoogleSheets(collectedLeadData, formatChatHistory(messages));
      }

      const html = marked.parse(assistantResponse) as string;
      removeTyping();
      chatMessages.appendChild(createMessageElement('assistant', html));
    } catch (error) {
      removeTyping();
      const errorMessage =
        error instanceof Error ? error.message : 'Co loi xay ra. Vui long thu lai sau.';
      const html = marked.parse(`**Xin lỗi**, ${errorMessage}\n\nBạn có thể thử lại hoặc đặt câu hỏi khác.`) as string;
      chatMessages.appendChild(createMessageElement('assistant', html));
    } finally {
      sendButton.disabled = false;
      scrollToBottom();
      input.focus();
    }
  }

  toggleButton.addEventListener('click', () => {
    if (root.classList.contains('is-open')) {
      closePanel();
      return;
    }

    openPanel();
  });

  closeButton.addEventListener('click', closePanel);
  refreshButton.addEventListener('click', resetConversation);
  input.addEventListener('input', autoResize);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    void sendMessage();
  });

  renderGreeting();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    void initChatbot();
  });
} else {
  void initChatbot();
}
