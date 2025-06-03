import { useState, useEffect, ChangeEvent } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDarkMode from '@/components/useDarkMode';
import useTextSize from '@/components/useTextSize';

export default function Settings() {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();

  const [darkMode, setDarkMode] = useDarkMode();
  const [language, setLanguage] = useState('en');
  const [textSize, setTextSize] = useTextSize();
  const [landingPage, setLandingPage] = useState('/dashboard');

  // Sync settings on client side only
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      if (savedLang) {
        setLanguage(savedLang);
        i18n.changeLanguage(savedLang);
      }

      const savedLanding = localStorage.getItem('landingPage');
      if (savedLanding) {
        setLandingPage(savedLanding);
      }
    }
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', darkMode.toString());
      localStorage.setItem('language', language);
      localStorage.setItem('textSize', textSize);
      localStorage.setItem('landingPage', landingPage);
    }
    i18n.changeLanguage(language);
    alert(t('save') || 'Saved');
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', selectedLang);
    }
    i18n.changeLanguage(selectedLang);
  };

  const handleTextSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedSize = e.target.value as 'small' | 'medium' | 'large';
    setTextSize(selectedSize);
    if (typeof window !== 'undefined') {
      localStorage.setItem('textSize', selectedSize);
    }
  };

  const handleLandingPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedPage = e.target.value;
    setLandingPage(selectedPage);
    if (typeof window !== 'undefined') {
      localStorage.setItem('landingPage', selectedPage);
    }
  };

  return (
    <div
      className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-[#a0b8c6] text-black'}`}
      data-text-size={textSize}
    >
      <header className="bg-[#092c48] text-white flex justify-between items-center px-6 py-4">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" className="w-8 h-8" alt={t('logoAlt') || 'Logo'} />
          <span className="text-xl font-bold">Nextplay stats</span>
        </div>
        <DropdownMenu
          label={t('account') || 'Account'}
          items={[
            { label: t('dashboard') || 'Dashboard', onClick: () => router.push('/dashboard') },
            { label: t('account') || 'Account', onClick: () => router.push('/account') },
            { label: t('settings') || 'Settings', onClick: () => router.push('/settings') },
            { label: t('help') || 'Help', onClick: () => router.push('/help') },
          ]}
        />
      </header>

      <main className="flex flex-col items-center py-12">
        <h1 className="text-2xl font-bold mb-6">{t('settings') || 'Settings'}</h1>

        <div
          className={`${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
          } rounded-lg shadow-md p-6 w-full max-w-md space-y-4`}
        >
          <label className="flex items-center space-x-4 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="form-checkbox h-5 w-5 text-blue-600"
              aria-checked={darkMode}
            />
            <span>{t('darkMode') || 'Dark Mode'}</span>
          </label>

          <label className="block">
            <span>{t('language') || 'Language'}</span>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              aria-label={t('language') || 'Language'}
            >
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="es">Español</option>
            </select>
          </label>

          <label className="block">
            <span>{t('textSize') || 'Text Size'}</span>
            <select
              value={textSize}
              onChange={handleTextSizeChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              aria-label={t('textSize') || 'Text Size'}
            >
              <option value="small">{t('small') || 'Small'}</option>
              <option value="medium">{t('medium') || 'Medium'}</option>
              <option value="large">{t('large') || 'Large'}</option>
            </select>
          </label>

          <label className="block">
            <span>{t('defaultLandingPage') || 'Default Landing Page'}</span>
            <select
              value={landingPage}
              onChange={handleLandingPageChange}
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              aria-label={t('defaultLandingPage') || 'Default Landing Page'}
            >
              <option value="/dashboard">{t('dashboard') || 'Dashboard'}</option>
              <option value="/account">{t('account') || 'Account'}</option>
              <option value="/help">{t('help') || 'Help'}</option>
              <option value="/settings">{t('settings') || 'Settings'}</option>
            </select>
          </label>

          <button
            type="button"
            onClick={handleSave}
            className="bg-[#3e5e73] hover:bg-[#2d4a5e] text-white font-semibold py-2 px-4 rounded"
          >
            {t('save') || 'Save'}
          </button>
        </div>
      </main>
    </div>
  );
}

// Server-side i18n support
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
