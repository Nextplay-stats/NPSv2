// src/pages/help.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import { useMsal } from '@azure/msal-react';
import useDarkMode from '@/components/useDarkMode';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const faqs = [
  {
    questionKey: 'faq.resetPasswordQuestion',
    answerKey: 'faq.resetPasswordAnswer',
  },
  {
    questionKey: 'faq.darkModeQuestion',
    answerKey: 'faq.darkModeAnswer',
  },
  {
    questionKey: 'faq.accessReportsQuestion',
    answerKey: 'faq.accessReportsAnswer',
  },
  {
    questionKey: 'faq.exportPlayerStatsQuestion',
    answerKey: 'faq.exportPlayerStatsAnswer',
  },
  {
    questionKey: 'faq.updateAccountDetailsQuestion',
    answerKey: 'faq.updateAccountDetailsAnswer',
  },
  {
    questionKey: 'faq.logoutQuestion',
    answerKey: 'faq.logoutAnswer',
  },
  {
    questionKey: 'faq.unknownTeamQuestion',
    answerKey: 'faq.unknownTeamAnswer',
  },
  {
    questionKey: 'faq.reportErrorQuestion',
    answerKey: 'faq.reportErrorAnswer',
  },
  {
    questionKey: 'faq.submitFeedbackQuestion',
    answerKey: 'faq.submitFeedbackAnswer',
  },
];

export default function Help() {
  const router = useRouter();
  const { instance } = useMsal();
  const [darkMode] = useDarkMode();

  const { t } = useTranslation('common');

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
        alert(t('questionSent'));
        setNewQuestion('');
      } else {
        alert(t('questionSendFailed'));
      }
    } catch (err) {
      console.error(err);
      alert(t('questionSendError'));
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      t(faq.questionKey).toLowerCase().includes(searchTerm.toLowerCase()) ||
      t(faq.answerKey).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt={t('logoAlt')} />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label={t('account')}
          items={[
            { label: t('dashboard'), onClick: () => router.push('/dashboard') },
            { label: t('account'), onClick: () => router.push('/account') },
            { label: t('settings'), onClick: () => router.push('/settings') },
            { label: t('help'), onClick: () => router.push('/help') },
            { label: t('logout'), onClick: handleLogout },
          ]}
        />
      </header>

      <main className="py-12 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('helpAndFaqs')}</h1>

        <input
          type="text"
          placeholder={t('searchFaqsPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded border border-gray-300 text-black"
          aria-label={t('searchFaqsAriaLabel')}
        />

        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-md p-6 mb-8 space-y-4`}>
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <div key={index} className="border-b pb-3">
                <p className="font-semibold">{t(faq.questionKey)}</p>
                <p>{t(faq.answerKey)}</p>
              </div>
            ))
          ) : (
            <p>{t('noMatchingFaqs')}</p>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-md p-6`}>
          <h2 className="text-lg font-semibold mb-2">{t('askQuestion')}</h2>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={t('typeYourQuestionHere')}
            className="w-full border border-gray-300 p-2 rounded mb-4 text-black"
            rows={3}
            aria-label={t('askQuestion')}
          />
          <button
            type="button"
            onClick={handleSend}
            className="bg-[#3e5e73] hover:bg-[#2d4a5e] text-white py-2 px-4 rounded"
          >
            {t('send')}
          </button>
        </div>
      </main>
    </div>
  );
}

// i18n support for locale
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
