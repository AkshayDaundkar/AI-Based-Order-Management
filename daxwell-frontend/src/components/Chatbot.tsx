// src/components/ChatBot.tsx
import { useState } from "react";
import axios from "axios";
import { Bot, SendHorizonal } from "lucide-react";

const ChatBot = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/chatbot", {
        question: input,
      });
      setResponse(res.data.answer || "No response available.");
    } catch (err) {
      console.error("Chatbot error:", err);
      setResponse("❌ Failed to get response. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 bg-gradient-to-br from-gray-900 to-slate-800 border border-gray-700 rounded-2xl p-6 shadow-md text-white">
      <div className="flex items-center gap-2 mb-3">
        <Bot className="text-blue-400" size={20} />
        <h2 className="text-lg font-bold">Ask Daxwell SmartBot</h2>
      </div>

      <div className="bg-gray-800 rounded-xl p-4 shadow-sm">
        <textarea
          rows={3}
          placeholder="Ask about orders, e.g., 'Which order is highest amount?'"
          className="w-full rounded-md bg-gray-900 text-white border border-gray-600 px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow-md"
          >
            <SendHorizonal size={16} /> {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>

      {response && (
        <div className="mt-4 border-t border-gray-700 pt-4 text-sm leading-relaxed text-gray-300 whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
