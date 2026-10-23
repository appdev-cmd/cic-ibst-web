import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutGrid,
  PhoneCall,
  FileText,
  Wrench,
  ShieldCheck,
  Building,
  BookOpen,
  MessageSquareText,
  ChevronRight,
  ChevronLeft,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

type TabKey =
  | 'home'
  | 'intro'
  | 'news'
  | 'state-gov'
  | 'research'
  | 'training'
  | 'testing'
  | 'consulting'
  | 'faq';

interface QuickMenuProps {
  lang?: 'vi' | 'en';
  activeTab?: TabKey;
  onNavigate?: (tab: TabKey, subTab?: string) => void;
}

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
};

const QUICK_ANSWERS: Record<string, string> = {
  qcvn06:
    'QCVN 06:2026/BXD là Quy chuẩn kỹ thuật quốc gia về An toàn cháy cho nhà và công trình do IBST chủ trì biên soạn trình Bộ Xây dựng ban hành, cập nhật các yêu cầu về giới hạn chịu lửa (EI, RE) và lối thoát nạn tiệm cận ISO 834 & NFPA 101.',
  lasxd:
    'Hệ thống phòng thí nghiệm LAS-XD của IBST (LAS-XD 01, 09, 18, 25, 38) đạt chuẩn VILAS/ISO 17025, thực hiện thử nghiệm chịu lửa cấu kiện, hầm gió khí động học, nén tĩnh cọc tải trọng lớn và cơ lý vật liệu UHPC.',
  chungnhan:
    'Văn phòng Chứng nhận của IBST được Bộ Xây dựng chỉ định thực hiện chứng nhận hợp quy vật liệu xây dựng theo QCVN 16:2023/BXD và chứng nhận hợp chuẩn TCVN. Liên hệ trực tiếp: 024 3754 4196.',
  kiemdinh:
    'IBST là đơn vị kiểm định độc lập hàng đầu cho các công trình trọng điểm Quốc gia (Sân bay Long Thành, Nhà Quốc hội, Thủy điện Sơn La, Metro số 1). Quý đơn vị có thể gửi yêu cầu kiểm định qua mục Tư vấn & Dịch vụ hoặc Hotline 024 3754 4196.',
};

export const QuickMenu: React.FC<QuickMenuProps> = ({
  lang = 'vi',
  onNavigate,
}) => {
  // Default expanded on large desktop (>= 1440px), collapsed pill on laptop screens so it never crowds content
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1440;
    }
    return false;
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      sender: 'bot',
      text:
        lang === 'vi'
          ? 'Xin chào! Tôi là Trợ lý thông tin trực tuyến của Viện KHCN Xây dựng (IBST). Quý khách cần tra cứu Quy chuẩn QCVN/TCVN, đăng ký thử nghiệm LAS-XD hay tư vấn kiểm định công trình?'
          : 'Hello! Welcome to the Institute for Building Science and Technology (IBST). How can I assist you with building codes, LAS-XD testing, or structural inspection today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, chatOpen]);

  const handleQuickPrompt = (key: string, label: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: label,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text:
          QUICK_ANSWERS[key] ||
          'Cảm ơn quý khách! Chuyên viên kỹ thuật của IBST sẽ phản hồi chi tiết qua Tổng đài 024 3754 4196 hoặc email vkhcnxd@ibst.vn.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const text = inputValue.trim();
    const newUserMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply =
        'Cảm ơn câu hỏi của bạn! Để được giải đáp chuyên sâu từ Hội đồng chuyên gia IBST, bạn có thể gọi Tổng đài 024 3754 4196 hoặc gửi câu hỏi tại mục "Hỏi - Đáp".';
      if (lower.includes('06') || lower.includes('cháy') || lower.includes('pccc')) {
        reply = QUICK_ANSWERS.qcvn06;
      } else if (lower.includes('las') || lower.includes('thí nghiệm') || lower.includes('thử nghiệm')) {
        reply = QUICK_ANSWERS.lasxd;
      } else if (lower.includes('hợp quy') || lower.includes('chứng nhận') || lower.includes('16')) {
        reply = QUICK_ANSWERS.chungnhan;
      } else if (lower.includes('kiểm định') || lower.includes('lún') || lower.includes('quan trắc')) {
        reply = QUICK_ANSWERS.kiemdinh;
      }

      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newBotMessage]);
      setIsTyping(false);
    }, 800);
  };

  const menuItems = [
    {
      id: 'standards',
      labelVi: 'Tra cứu QCVN - TCVN',
      labelEn: 'QCVN & TCVN Lookup',
      icon: FileText,
      action: () => {
        onNavigate?.('state-gov', 'quy-chuan-tieu-chuan');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'testing',
      labelVi: 'Thí nghiệm LAS-XD',
      labelEn: 'LAS-XD Lab Testing',
      icon: Wrench,
      action: () => {
        onNavigate?.('testing', 'thi-nghiem');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'cert',
      labelVi: 'Chứng nhận Hợp quy',
      labelEn: 'Conformity Cert',
      icon: ShieldCheck,
      action: () => {
        onNavigate?.('testing', 'chung-nhan');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'inspection',
      labelVi: 'Kiểm định Công trình',
      labelEn: 'Structural Audit',
      icon: Building,
      action: () => {
        onNavigate?.('testing', 'kiem-dinh');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'research',
      labelVi: 'CSDL Đề tài KH&CN',
      labelEn: 'R&D Database',
      icon: BookOpen,
      action: () => {
        onNavigate?.('research', 'all');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'qa-ai',
      labelVi: 'Hỏi đáp & Trợ lý AI',
      labelEn: 'Q&A & AI Assistant',
      icon: MessageSquareText,
      badge: 'AI',
      action: () => {
        setChatOpen(true);
      },
    },
  ];

  return (
    <>
      {/* ─── FLOATING QUICK MENU (MUASAMCONG STYLE) ─── */}
      <div className="fixed right-2 md:right-3 top-1/2 -translate-y-1/2 z-40 select-none">
        {isExpanded ? (
          /* EXPANDED CARD STATE */
          <div className="w-[186px] xl:w-[204px] rounded-xl bg-surface border border-border shadow-[0_12px_30px_-6px_rgba(15,23,42,0.22)] dark:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.65)] overflow-hidden animate-fade-in">
            {/* Header Bar */}
            <div className="bg-gradient-to-r from-[#134686] via-primary-700 to-primary-600 text-white px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <LayoutGrid size={13} className="text-white/95 shrink-0" />
                <span className="text-[11px] font-extrabold uppercase tracking-wider">
                  {lang === 'vi' ? 'MENU NHANH' : 'QUICK MENU'}
                </span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                title={lang === 'vi' ? 'Thu gọn' : 'Collapse'}
                className="w-5 h-5 rounded-md hover:bg-white/15 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Highlighted Hotline Item (Warm Orange Tint like muasamcong) */}
            <a
              href="tel:02437544196"
              className="flex items-center gap-2.5 px-3 py-2 bg-[#fff5eb] dark:bg-amber-950/40 hover:bg-[#ffead5] dark:hover:bg-amber-900/50 border-b border-amber-200/70 dark:border-amber-800/40 transition-colors cursor-pointer group"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                <PhoneCall size={13} />
              </div>
              <div className="text-left min-w-0">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 block leading-tight">
                  {lang === 'vi' ? 'Tổng đài' : 'Hotline'}
                </span>
                <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight block leading-tight mt-0.5">
                  024 3754 4196
                </span>
              </div>
            </a>

            {/* Action Items List */}
            <div className="divide-y divide-border-subtle bg-surface">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full px-3 py-2 flex items-center gap-2.5 text-left hover:bg-primary-500/8 dark:hover:bg-primary-500/15 transition-colors cursor-pointer group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-muted group-hover:bg-primary-500 border border-border group-hover:border-primary-500 flex items-center justify-center text-ink-secondary group-hover:text-white shrink-0 transition-all duration-200">
                      <Icon size={13} />
                    </div>
                    <span className="flex-1 text-[11px] font-bold text-ink-secondary group-hover:text-primary-600 dark:group-hover:text-primary-400 leading-snug transition-colors">
                      {lang === 'vi' ? item.labelVi : item.labelEn}
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-primary-500/15 text-primary-600 dark:text-primary-300 border border-primary-500/20">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Collapse Button (matches muasamcong bottom bar) */}
            <button
              onClick={() => setIsExpanded(false)}
              title={lang === 'vi' ? 'Thu gọn Menu nhanh' : 'Collapse Quick Menu'}
              className="w-full py-1.5 bg-subtle hover:bg-muted border-t border-border-subtle flex items-center justify-center text-ink-muted hover:text-primary-500 transition-colors cursor-pointer group"
            >
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
          </div>
        ) : (
          /* COLLAPSED VERTICAL PILL STATE (matches Screenshot 3 of muasamcong) */
          <button
            onClick={() => setIsExpanded(true)}
            title={lang === 'vi' ? 'Mở Menu nhanh' : 'Open Quick Menu'}
            className="w-[36px] py-2 rounded-full bg-gradient-to-b from-[#134686] via-primary-700 to-primary-900 text-white shadow-[0_8px_20px_-4px_rgba(15,23,42,0.45)] border border-white/20 flex flex-col items-center justify-between gap-2 cursor-pointer hover:brightness-110 transition-all duration-200 group"
          >
            {/* Top Orange Icon Badge */}
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <LayoutGrid size={12} />
            </div>

            {/* Vertical Label */}
            <span
              className="text-[11px] font-extrabold tracking-wider text-white/95 whitespace-nowrap py-1"
              style={{ writingMode: 'vertical-rl' }}
            >
              {lang === 'vi' ? 'Menu nhanh' : 'Quick Menu'}
            </span>

            {/* Bottom Circle Expand Indicator */}
            <div className="w-5 h-5 rounded-full border border-white/35 bg-white/10 group-hover:bg-white/25 flex items-center justify-center transition-colors">
              <ChevronLeft size={11} />
            </div>
          </button>
        )}
      </div>

      {/* ─── INTEGRATED IBST AI ASSISTANT & QUICK Q&A DRAWER/MODAL ─── */}
      {chatOpen && (
        <div className="fixed bottom-5 right-5 z-50 w-[380px] max-w-[calc(100vw-24px)] h-[520px] max-h-[calc(100vh-80px)] flex flex-col bg-surface border border-border shadow-2xl rounded-2xl overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#134686] via-primary-700 to-primary-600 text-white">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center border border-white/15">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-primary-700 rounded-full"></span>
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-xs tracking-wide">
                  {lang === 'vi' ? 'Trợ lý Số IBST' : 'IBST Digital Assistant'}
                </h3>
                <p className="text-[11px] text-white/80 font-medium">
                  {lang === 'vi' ? 'Hỗ trợ tra cứu QCVN, TCVN & Dịch vụ' : 'Codes, Standards & Services Support'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setChatOpen(false);
                  onNavigate?.('faq', 'all');
                }}
                title={lang === 'vi' ? 'Mở trang Hỏi - Đáp' : 'Go to Q&A Page'}
                className="px-2 py-1 text-[11px] font-bold bg-white/15 hover:bg-white/25 rounded-lg text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>{lang === 'vi' ? 'Hỏi - Đáp' : 'Q&A'}</span>
                <ArrowUpRight size={12} />
              </button>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Topic Chips */}
          <div className="px-3.5 py-2 bg-subtle border-b border-border-subtle flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <Sparkles size={13} className="text-primary-500 shrink-0" />
            {[
              { key: 'qcvn06', label: 'QCVN 06:2026 PCCC' },
              { key: 'lasxd', label: 'Thử nghiệm LAS-XD' },
              { key: 'chungnhan', label: 'Chứng nhận Hợp quy' },
              { key: 'kiemdinh', label: 'Kiểm định công trình' },
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => handleQuickPrompt(chip.key, chip.label)}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-surface hover:bg-primary-500 hover:text-white text-ink-secondary border border-border transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-page/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex w-full',
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'flex max-w-[85%] items-start gap-2',
                    msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  )}
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
                      msg.sender === 'user'
                        ? 'bg-muted text-ink-secondary border border-border'
                        : 'bg-primary-500/15 text-primary-600 dark:text-primary-400 border border-primary-500/20'
                    )}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={cn(
                      'px-3.5 py-2.5 text-xs leading-relaxed font-medium shadow-xs text-left',
                      msg.sender === 'user'
                        ? 'bg-primary-600 text-white rounded-2xl rounded-tr-xs'
                        : 'bg-surface border border-border text-ink rounded-2xl rounded-tl-xs'
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex w-full justify-start">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary-500/15 text-primary-500">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="px-3.5 py-2.5 bg-surface border border-border rounded-2xl rounded-tl-xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-surface border-t border-border">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={
                  lang === 'vi'
                    ? 'Nhập câu hỏi về QCVN, thử nghiệm, kiểm định...'
                    : 'Ask about building codes, lab testing...'
                }
                className="w-full pl-3.5 pr-10 py-2 bg-muted/60 border border-border rounded-xl text-xs font-medium text-ink focus:bg-surface focus:border-primary-500 focus:outline-none transition-all"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="absolute right-1.5 p-1.5 text-white bg-primary-500 hover:bg-primary-600 disabled:opacity-40 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
