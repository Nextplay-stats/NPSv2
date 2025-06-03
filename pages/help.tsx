// pages/help.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import useDarkMode from '@/hooks/useDarkMode';

const faqs = [
  { question: 'How do I reset my password?', answer: 'Please contact your admin for a reset link.' },
  { question: 'How do I submit a player stat?', answer: 'Navigate to the Player Stats report and fill in the form.' },
  { question: 'Why can’t I access the NBL Overview?', answer: 'Access depends on your role. Contact your admin.' },
];

export default function Help() {
  const router = useRouter();
  const { darkMode, setDarkMode } = useDarkMode();
  const [newQuestion, setNewQuestion] = useState('');

  const handleSend = () => {
    alert(`Question submitted: ${newQuestion}`);
    setNewQuestion('');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label="Account"
          items={[
            { label: 'Dashboard', onClick: () => router.push('/dashboard') },
            { label: 'Dashboard', onClick: () => router.push('/account') },
            { label: 'Settings', onClick: () => router.push('/settings') },
            { label: 'Help', onClick: () => router.push('/help') },
            { label: 'Logout', onClick: handleLogout },
            { label: 'Logout', onClick: () => alert('Logout not implemented yet.') },
          ]}
        />
      </header>

      <main className="py-12 max-w-2xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Help & FAQs</h1>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span>Dark Mode</span>
          </label>
        </div>

        <div className="bg-white text-black rounded-lg shadow-md p-6 mb-8 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-3">
              <p className="font-semibold">{faq.question}</p>
              <p>{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="bg-white text-black rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Ask a Question</h2>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Type your question here..."
            className="w-full border border-gray-300 p-2 rounded mb-4"
            rows={3}
          />
          <button
            onClick={handleSend}
            className="bg-[#3e5e73] hover:bg-[#2d4a5e] text-white py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
