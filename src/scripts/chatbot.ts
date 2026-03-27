import { marked } from 'marked';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

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

      const payload = (await response.json()) as { content?: string; error?: string };

      if (!response.ok || !payload.content) {
        throw new Error(payload.error || 'Khong the lay phan hoi tu AI.');
      }

      messages.push({ role: 'assistant', content: payload.content });
      const html = marked.parse(payload.content) as string;
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
