// pages/help.tsx
import { useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';

export default function Help() {
  const [search, setSearch] = useState('');
  const [question, setQuestion] = useState('');
  const router = useRouter();

  const handleSend = () => {
    alert(`Your question has been submitted: ${question}`);
    setQuestion('');
  };

  return (
    <div className="min-h-screen bg-[#a0b8c6] text-black">
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt="Logo" />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label="Account"
          items={[
            { label: 'Dashboard', onClick: () => router.push('/dashboard') },
            { label: 'Logout', onClick: () => alert('Logout not implemented yet.') },
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12 px-4">
        <h1 className="text-2xl font-bold mb-6">Help & FAQ</h1>

        <div className="mb-8 w-full max-w-2xl">
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded border border-gray-300"
          />
        </div>

        <div className="w-full max-w-2xl bg-white text-black rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Can't find your question?</h2>
          <textarea
            placeholder="Ask your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-32 p-3 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleSend}
            className="bg-[#3e5e73] hover:bg-[#2d4a5e] text-white font-semibold py-2 px-4 rounded"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
