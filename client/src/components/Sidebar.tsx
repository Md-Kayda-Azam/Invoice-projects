import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
interface SidebarProps {
  isVisible: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ isVisible }) => {
  const [MenuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const toggleClientMenu = () => {
    setMenuOpen(!MenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth > 1000);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  useEffect(() => {
    const pathname = location.pathname;
    const isMatchingPath = [
      '/all-invoice',
      '/add-invoice',
      '/invoice-details',
    ].includes(pathname);
    setMenuOpen(isMatchingPath);
  }, [location.pathname]);
  return (
    <div>
      <aside
        id="sidebar"
        className={`fixed ${
          isDesktop || isVisible
            ? 'lg:w-64 z-2 h-screen pb-10  top-0 mt-5  left-0 pt-16 pl-2 flex lg:flex flex-shrink-0 flex-col'
            : 'w-0'
        } transition-width duration-75`}
      >
        {/* z-20 h-full top-0 left-0 pt-16 flex lg:flex flex-shrink-0 flex-col w-64 */}
        <div className="relative flex-1 shadow-lg rounded-lg flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 bg-white  space-y-1">
              <ul className="space-y-2 pb-2">
                <li>
                  <Link
                    to="/"
                    className={`text-base text-gray-900 font-normal rounded-lg flex items-center p-2  group ${
                      isActive('/') && 'bg-[#E7E7FF]'
                    }`}
                  >
                    <svg
                      className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                      fill={`${isActive('/') ? '#53BD70' : '#818E9B'}`}
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                      <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                    </svg>
                    <span
                      className={`ml-3 font-semibold text-[#818E9B] ${
                        isActive('/') && 'text-secondary'
                      }`}
                    >
                      Dashboard
                    </span>
                  </Link>
                </li>

                <li className="group">
                  <div
                    className="text-base cursor-pointer text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100"
                    onClick={toggleClientMenu}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                      viewBox="0 0 384 512"
                      fill="#818E9B"
                    >
                      <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM80 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H80c-8.8 0-16-7.2-16-16s7.2-16 16-16zm16 96H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V256c0-17.7 14.3-32 32-32zm0 32v64H288V256H96zM240 416h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16s7.2-16 16-16z" />
                    </svg>
                    <span className="ml-3 font-semibold text-[#818E9B]">
                      Invoice Management
                    </span>
                    {MenuOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="12"
                        viewBox="0 0 384 512"
                        className="ml-3"
                        fill="#818E9B"
                      >
                        <path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="14"
                        fill="#818E9B"
                        className="ml-3 "
                        viewBox="0 0 448 512"
                      >
                        <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
                      </svg>
                    )}
                  </div>
                  {MenuOpen && (
                    <ul className="pl-6 space-y-2">
                      <li>
                        <Link
                          to="/all-invoice"
                          className={`text-base text-gray-900 font-normal rounded-lg flex items-center p-2  group ${
                            isActive('/all-invoice') && 'bg-[#E7E7FF]'
                          }`}
                        >
                          {' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-gray-500 group-hover:text-gray-900 transition duration-75"
                            viewBox="0 0 512 512"
                            fill={`${
                              isActive('/all-invoice') ? '#53BD70' : '#818E9B'
                            }`}
                          >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-352a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                          </svg>
                          <span
                            className={`ml-3  font-semibold flex-1 whitespace-nowrap text-[#818E9B] ${
                              isActive('/all-invoice') && 'text-secondary'
                            }`}
                          >
                            Invoice
                          </span>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/add-invoice"
                          className={`text-base text-gray-900 font-normal rounded-lg flex items-center p-2  group ${
                            isActive('/add-invoice') && 'bg-[#E7E7FF]'
                          }`}
                        >
                          {' '}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-gray-500 group-hover:text-gray-900 transition duration-75"
                            viewBox="0 0 512 512"
                            fill={`${
                              isActive('/add-invoice') ? '#53BD70' : '#818E9B'
                            }`}
                          >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-352a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                          </svg>
                          <span
                            className={`ml-3  font-semibold flex-1 whitespace-nowrap text-[#818E9B] ${
                              isActive('/add-invoice') && 'text-secondary'
                            }`}
                          >
                            Add Invoice
                          </span>
                        </Link>
                      </li>{' '}
                      <li>
                        <Link
                          to="/invoice-details"
                          className={`text-base text-gray-900 font-normal rounded-lg flex items-center p-2  group ${
                            isActive('/invoice-details') && 'bg-[#E7E7FF]'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-gray-500 group-hover:text-gray-900 transition duration-75"
                            viewBox="0 0 512 512"
                            fill={`${
                              isActive('/invoice-details')
                                ? '#53BD70'
                                : '#818E9B'
                            }`}
                          >
                            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-352a96 96 0 1 1 0 192 96 96 0 1 1 0-192z" />
                          </svg>

                          <span
                            className={`ml-3 font-semibold flex-1 whitespace-nowrap text-[#818E9B] ${
                              isActive('/invoice-details') && 'text-secondary'
                            }`}
                          >
                            Invoice Details
                          </span>
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li>
                  <Link
                    to="/client"
                    className={`text-base text-gray-900 font-normal rounded-lg flex items-center p-2  group ${
                      isActive('/client') && 'bg-[#E7E7FF]'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-5 text-gray-500  transition duration-75"
                      viewBox="0 0 640 512"
                      fill={`${isActive('/client') ? '#53BD70' : '#818E9B'}`}
                    >
                      <path d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192h42.7c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0H21.3C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7h42.7C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3H405.3zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352H378.7C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7H154.7c-14.7 0-26.7-11.9-26.7-26.7z" />
                    </svg>
                    <span
                      className={`ml-3 flex-1 whitespace-nowrap font-semibold text-[#818E9B] ${
                        isActive('/client') && 'text-secondary'
                      }`}
                    >
                      Clients
                    </span>
                  </Link>
                </li>
              </ul>
              <div className="space-y-2 pt-2">
                <Link
                  to="/setting"
                  className={`text-base text-gray-900 font-normal rounded-lg flex items-center p-2  group ${
                    isActive('/setting') && 'bg-[#E7E7FF]'
                  }`}
                >
                  <svg
                    className={`w-5 h-5 text-[#818E9B] flex-shrink-0 transition duration-75 ${
                      isActive('/setting') && 'text-secondary'
                    }`}
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="gem"
                    fill={`${isActive('/setting') ? '#53BD70' : '#818E9B'}`}
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M378.7 32H133.3L256 182.7L378.7 32zM512 192l-107.4-141.3L289.6 192H512zM107.4 50.67L0 192h222.4L107.4 50.67zM244.3 474.9C247.3 478.2 251.6 480 256 480s8.653-1.828 11.67-5.062L510.6 224H1.365L244.3 474.9z"
                    />
                  </svg>
                  <span
                    className={`ml-4 text-[#818E9B] font-semibold ${
                      isActive('/setting') && 'text-secondary'
                    }`}
                  >
                    Setting
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
