import { useState } from 'react';

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'You can reset your password via the Microsoft login page by clicking "Forgot password?".',
  },
  {
    question: 'Why can’t I see my team’s stats?',
    answer: 'Make sure your role is Coach, NBL, or Admin to access team statistics.',
  },
  {
    question: 'How do I log out?',
    answer: 'Click on the "Account" dropdown in the header and select "Logout".',
  },
  {
    question: 'What does the Player Stats report show?',
    answer: 'It provides detailed performance metrics for individual players.',
  },
];

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedQuestion, setSubmittedQuestion] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleQuestionSubmit = () => {
    if (!submittedQuestion.trim()) return;
    console.log('Submitted question:', submittedQuestion);
    setConfirmation('Thank you! Your question has been submitted.');
    setSubmittedQuestion('');
    setTimeout(() => setConfirmation(''), 5000);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fa] p-8 text-gray-800">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-[#092c48] mb-4">Help Center</h1>

        {/* Search bar */}
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full p-2 border border-gray-300 rounded-md mb-6"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* FAQ List */}
        <div className="space-y-4 mb-10">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index}>
                <h2 className="font-semibold">{faq.question}</h2>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No FAQs match your search.</p>
          )}
        </div>

        {/* Ask a question box */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-2">Still need help?</h2>
          <textarea
            value={submittedQuestion}
            onChange={(e) => setSubmittedQuestion(e.target.value)}
            placeholder="Ask your question here..."
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={handleQuestionSubmit}
            className="mt-3 bg-[#092c48] text-white px-4 py-2 rounded-md hover:bg-[#0b3c64]"
          >
            Send
          </button>
          {confirmation && <p className="text-green-600 mt-2">{confirmation}</p>}
        </div>
      </div>
    </div>
  );
}
