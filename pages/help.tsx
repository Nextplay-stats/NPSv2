import { useState } from 'react';
import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import useDarkMode from '@/components/useDarkMode';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'External authentication (e.g. Microsoft login) requires you to go through their process of forgetting a password. To do this, click “Forgot my password” during the login process.',
  },
  {
    question: 'How do I switch between dark and light mode?',
    answer: 'You can toggle dark mode in the Settings page. Your preference will be saved across sessions.',
  },
  {
    question: 'How do I access different reports?',
    answer: 'Reports are available from the Dashboard Page based on your role. Just click on a report to open it.',
  },
  {
    question: 'Can I export player stats?',
    answer: 'Exporting is available on some of our tables. To do this, hover over the table, find the three dots button. Click it and select export data. A pop up will come up and go through the process to download the data.',
  },
  {
    question: 'How do I update my account details?',
    answer: 'Account information (name, team, role) is currently managed by Nextplaystats@outlook.com. For changes, please send us an email.',
  },
  {
    question: 'How do I log out of my account?',
    answer: 'Use the Logout option in the dropdown menu in the top-right corner of any page.',
  },
  {
    question: 'Why do I see “Unknown Team” under my name?',
    answer: 'This means your Microsoft profile does not include a job title or team assignment. Contact nextplaystats@outlook.com so we can update your profile in Microsoft 365.',
  },
  {
    question: 'What do I do if a report page shows an error or is blank?',
    answer: 'Try refreshing the page or logging out and back in. If the problem persists, contact nextplaystats@outlook.com with a screenshot and a description of the issue.',
  },
  {
    question: 'How do I submit feedback or ask for a feature?',
    answer: 'Use the “Ask a Question” box on this page or email support at nextplaystats@outlook.com.',
  },
];

export default function Help() {
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [newQuestion, setNewQuestion] = useState('');

  const handleSend = async () => {
    if (!newQuestion.trim()) return;
    try {
      const res = await fetch('/api/ask-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: newQuestion }),
      });

      if (res.ok) {
        alert('Your question has been emailed to support!');
        setNewQuestion('');
      } else {
        alert('Failed to send your question. Please try again.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while sending your question.');
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
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
            { label: 'Logout', onClick: () => router.push('/api/auth/logout') },
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
          className="w-full mb-6 px-4 py-2 rounded border border-gray-300 text-black"
        />

        <div className="bg-white text-black rounded-lg shadow-md p-6 mb-8 space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="border-b pb-3">
                <p className="font-semibold">{faq.question}</p>
                <p>{faq.answer}</p>
              </div>
            ))
          ) : (
            <p>No matching FAQs found.</p>
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
