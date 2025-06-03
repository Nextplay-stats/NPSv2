import { useState } from 'react';
import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import useDarkMode from '@/components/useDarkMode';

const faqs = [
  { question: 'How do I reset my password?', answer: 'Please contact your admin for a reset link.' },
  { question: 'How do I submit a player stat?', answer: 'Navigate to the Player Stats report and fill in the form.' },
  { question: 'Why can’t I access the NBL Overview?', answer: 'Access depends on your role. Contact your admin.' },
];

export default function Help() {
  const router = useRouter();
  const [darkMode] = useDarkMode();
  const [newQuestion, setNewQuestion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSend = () => {
    alert(`Question submitted: ${newQuestion}`);
    setNewQuestion('');
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            { label: 'Account', onClick: () => router.push('/account') },
            { label: 'Settings', onClick: () => router.push('/settings') },
            { label: 'Help', onClick: () => router.push('/help') },
            { label: 'Logout', onClick: () => alert('Logout not implemented yet.') },
          ]}
        />
      </header>

      <main className="py-12 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Help & FAQs</h1>

        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 mb-6 rounded border border-gray-300 text-black"
        />

        <div className="bg-white text-black rounded-lg shadow-md p-6 mb-8 space-y-4">
          {filteredFaqs.length ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="border-b pb-3">
                <p className="font-semibold">{faq.question}</p>
                <p>{faq.answer}</p>
              </div>
            ))
          ) : (
            <p>No FAQs matched your search.</p>
          )}
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
