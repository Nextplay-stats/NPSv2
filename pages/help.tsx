// src/pages/help.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import DropdownMenu from '@/components/DropdownMenu';
import { useMsal } from '@azure/msal-react';
import useDarkMode from '@/components/useDarkMode';

import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const faqs = [
  { questionKey: 'How do I reset my password?', answerKey: 'External authentication (e.g. Microsoft login) requires you to go through their process of forgetting a password.  To do this, click “Forgot my password” during the login process.' },
  { questionKey: 'How do I switch between dark and light mode?', answerKey: 'You can toggle dark mode in the Settings page. Your preference will be saved across sessions.' },
  { questionKey: 'How do I access different reports?', answerKey: 'Reports are available from the Dashboard Page based on your role. Just click on a report to open it.' },
  { questionKey: 'Can I export player stats?', answerKey: 'Exporting is available on some of our tables.  To do this, hover over the table, find the three dots button.  Click it and select export data.  A pop up will come up and go through the process to download the data.' },
  { questionKey: 'How do I update my account details?', answerKey: 'Account information (name, team, role) is currently managed by Nextplaystats@outlook.com. For changes, please send us an email.' },
  { questionKey: 'How do I log out of my account?', answerKey: 'Use the Logout option in the dropdown menu in the top-right corner of any page.' },
  { questionKey: 'Why do I see “Unknown Team” under my name?', answerKey: 'This means your Microsoft profile does not include a job title or team assignment. Contact nextplaystats@outlook.com so we can update your profile in Microsoft 365.' },
  { questionKey: 'What do I do if a report page shows an error or is blank?', answerKey: 'Try refreshing the page or logging out and back in. If the problem persists, contact nextplaystats@outlook.com with a screenshot and a description of the issue.' },
  { questionKey: 'How do I submit feedback or ask for a feature?', answerKey: 'Use the “Ask a Question” box on this page or email support at nextplaystats@outlook.com' },
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
        alert(t('questionSent').toString());
        setNewQuestion('');
      } else {
        alert(t('questionSendFailed').toString());
      }
    } catch (err) {
      console.error(err);
      alert(t('questionSendError').toString());
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      t(faq.questionKey).toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      t(faq.answerKey).toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    instance.logoutRedirect();
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}>
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt={t('logoAlt')?.toString() || 'Logo'} />
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
          placeholder={t('searchFaqsPlaceholder')?.toString()}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-6 px-4 py-2 rounded border border-gray-300 text-black"
          aria-label={t('searchFaqsAriaLabel')?.toString()}
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
            placeholder={t('typeYourQuestionHere')?.toString()}
            className="w-full border border-gray-300 p-2 rounded mb-4 text-black"
            rows={3}
            aria-label={t('askQuestion')?.toString()}
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

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
