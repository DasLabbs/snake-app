import React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { useTranslation } from '@src/hooks/use-translation';
import UserProvider from '@src/providers/user-provider';

import SwitchLangBtn from './switch-lang-btn';

const Layout = () => {
  const { language } = useTranslation();

  return (
    <UserProvider>
      <div className="border-outset layout-bg relative mx-auto flex h-dvh w-full items-center justify-center overflow-hidden md:w-[450px]">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div
            className={`relative mt-[7.7dvh] flex h-[69.1dvh] w-[75%] flex-col items-center justify-center ${language === 'en' ? 'font-pixel' : 'font-cubic'}`}
          >
            <div className="flex h-full w-full items-center justify-center">
              <Outlet />
              <Toaster
                position="top-center"
                containerStyle={{
                  fontSize: '12px',
                  lineHeight: '12px',
                }}
              />
            </div>
          </div>
        </div>
        <div className="absolute right-8 top-8">
          <SwitchLangBtn />
        </div>
      </div>
    </UserProvider>
  );
};

export default Layout;
