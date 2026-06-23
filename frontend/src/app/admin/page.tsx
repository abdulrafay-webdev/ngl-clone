"use client";

import { useState, useEffect } from "react";

interface Message {
  id: string;
  name: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMessages = async (token: string) => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data);
        setIsAuthorized(true);
        localStorage.setItem("admin_token", token);
      } else {
        setError("Invalid password. Please try again.");
        setIsAuthorized(false);
      }
    } catch (err) {
      setError("Failed to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("admin_token");
    if (savedToken) {
      fetchMessages(savedToken);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    fetchMessages(password);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${apiUrl}/api/messages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== id));
      } else {
        alert("Failed to delete message.");
      }
    } catch (err) {
      alert("Error deleting message.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthorized(false);
    setMessages([]);
    setPassword("");
  };

  if (!isAuthorized) {
    return (
      <main className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-2">Please enter your password to continue.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
            />
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Inbox</h1>
            <p className="text-white/80">{messages.length} messages received</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2 bg-white text-pink-600 font-bold rounded-full hover:bg-gray-100 transition-colors"
          >
            Logout
          </button>
        </div>

        {loading ? (
          <div className="text-center text-white text-xl">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center bg-white rounded-3xl p-12 shadow-xl">
            <p className="text-gray-500 text-lg">No messages yet. Share your link!</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white rounded-3xl p-6 shadow-xl relative group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{msg.name}</h3>
                    <p className="text-xs text-gray-400">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="Delete message"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
