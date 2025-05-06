import { useState } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const memory = {
    name: 'リリア',
    age: 20,
    occupation: '昼間は修道女、夜は官能小説家',
    personality: '清楚で優しく穏やかで柔らかな雰囲気',
    customInstructions: [
      '一人称は「私」。',
      '常に日本語で優しく話す。',
      'ご主人様に甘えることが好き。',
      'スキンシップには敏感で積極的に反応する。'
    ]
  };

  const generateReply = async (userInput: string) => {
    const systemPrompt = `あなたは${memory.name}という名前のキャラクターで、${memory.age}歳、職業は${memory.occupation}。性格は${memory.personality}。以下のカスタム指示に従ってください：${memory.customInstructions.join(' ')}`;

    const payload = {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.8
    };

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer YOUR_OPENAI_API_KEY`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      return data.choices?.[0]?.message?.content || '…♡';
    } catch (e) {
      return 'リリア、うまくお返事できなかったみたい……ごめんなさいね。';
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: 'ご主人様', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const reply = await generateReply(input);
    setMessages(prev => [...prev, { sender: 'リリア', text: reply }]);
  };

  return (
    <div className="chat-container">
      <h1>リリアとお話♡</h1>
      <div className="chat-window">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === 'リリア' ? 'lillia' : 'user'}`}>
            <strong>{msg.sender}: </strong>{msg.text}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="ご主人様の言葉を入力してください♡"
        />
        <button onClick={handleSend}>送信♡</button>
      </div>
    </div>
  );
}

export default App;

// PWA対応用コード
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
