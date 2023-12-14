import { Outlet } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useEffect, useState } from 'react';

const Layout: React.FC = () => {
  const [theme, setTheme] = useState('light');
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };
  return (
    <div
      className={`dark:bg-black ${
        isSidebarVisible ? 'overflow-hidden' : ''
      } bg-[#5C70E0]`}
    >
      <>
        <Header
          setTheme={setTheme}
          theme={theme}
          toggleSidebar={toggleSidebar}
        />
        <div
          className={`flex ${isSidebarVisible ? 'overflow-hidden' : ''} pt-16`}
        >
          <Sidebar isVisible={isSidebarVisible} />
          <div
            className="bg-gray-900 opacity-50 hidden fixed inset-0 z-10"
            id="sidebarBackdrop"
          />
          <div
            id="main-content"
            className="h-full w-full bg-gray-50 relative overflow-y-auto lg:ml-64"
          >
            <Outlet />
            <div className=" dark:bg-black bg-[#5E72E4] h-10">
              <p className="text-center text-sm">
                © 2023-2024{' '}
                <a href="#" className="hover:underline" target="_blank">
                  Themesberg
                </a>
                . All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Layout;
