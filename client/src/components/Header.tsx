import { useState } from 'react';
import Avatar from './Avatar';
import {
  useGetLoggedUserQuery,
  useSignoutUserMutation,
} from '../redux/features/auth/authSlice.ts';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllSettingsQuery } from '../redux/features/setting/settingSlice.ts';

interface HeaderProps {
  setTheme: (theme: string) => void;
  theme: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ setTheme, theme, toggleSidebar }) => {
  const { data: user } = useGetLoggedUserQuery('ok');
  const { data } = useGetAllSettingsQuery('ok');
  const logoFile = data && data.length > 0 ? data[0]?.logo : 'defaultLogo';

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [signoutUser] = useSignoutUserMutation();

  const handleThemeSwitch = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSignout = async () => {
    try {
      // Call the signout mutation
      await signoutUser('ok').unwrap();
      navigate('/signin');
      // Handle successful signout (e.g., redirect to login page)
      console.log('User signed out successfully!');
    } catch (error) {
      // Handle signout error
      console.error('Signout failed. Please try again.', error);
    }
  };
  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <div>
      <nav className="bg-[#339CCB] border-b border-gray-200 fixed z-30 w-full">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={toggleSidebar}
                className="lg:hidden mr-2 text-gray-600 hover:text-gray-900 cursor-pointer p-2 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 rounded"
              >
                <svg
                  id="toggleSidebarMobileHamburger"
                  className="w-6 h-6"
                  fill="#53BD70"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <svg
                  id="toggleSidebarMobileClose"
                  className="w-6 h-6 hidden"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <a
                href="#"
                className="text-xl font-bold flex items-center lg:ml-2.5"
              >
                <img src={logoFile} className="h-8 mr-2" alt="Windster Logo" />
                <h5 className="text-white font-bold leading-4 opacity-100 tracking-tighter text-lowercase transition-opacity duration-350 ease-in-out">
                  Invoice
                </h5>
              </a>
            </div>
            <div className="flex items-center">
              <button
                id="toggleSidebarMobileSearch"
                type="button"
                className="lg:hidden text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg"
              >
                <span className="sr-only">Search</span>
                <svg
                  className="w-6 h-6"
                  fill="#53BD70"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="hidden lg:flex items-center">
                <div className="-mb-1" onClick={handleThemeSwitch}>
                  <a
                    className="github-button"
                    href="#"
                    data-color-scheme="no-preference: dark; light: light; dark: light;"
                    data-icon="octicon-star"
                    data-size="large"
                    data-show-count="true"
                    aria-label="Star themesberg/windster-tailwind-css-dashboard on GitHub"
                  >
                    {/* <svg
                      xmlns="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      font-size="22px"
                      className="iconify iconify--bx"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M6.993 12c0 2.761 2.246 5.007 5.007 5.007s5.007-2.246 5.007-5.007S14.761 6.993 12 6.993S6.993 9.239 6.993 12zM12 8.993c1.658 0 3.007 1.349 3.007 3.007S13.658 15.007 12 15.007S8.993 13.658 8.993 12S10.342 8.993 12 8.993zM10.998 19h2v3h-2zm0-17h2v3h-2zm-9 9h3v2h-3zm17 0h3v2h-3zM4.219 18.363l2.12-2.122l1.415 1.414l-2.12 2.122zM16.24 6.344l2.122-2.122l1.414 1.414l-2.122 2.122zM6.342 7.759L4.22 5.637l1.415-1.414l2.12 2.122zm13.434 10.605l-1.414 1.414l-2.122-2.122l1.414-1.414z"
                      ></path>
                    </svg> */}
                    {/* <svg
                      xmlns="http://www.w3.org/1999/xlink"
                      aria-hidden="true"
                      role="img"
                      font-size="22px"
                      className="iconify iconify--bx"
                      width="1em"
                      height="1em"
                      fill="#818E9B"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243 0 14.143a9.937 9.937 0 0 0 7.072 2.93a9.93 9.93 0 0 0 7.07-2.929a10.007 10.007 0 0 0 2.583-4.491a1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343a7.953 7.953 0 0 1-5.658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483a10.027 10.027 0 0 0 2.89 7.848a9.972 9.972 0 0 0 7.848 2.891a8.036 8.036 0 0 1-1.484 2.059z"
                      ></path>
                    </svg> */}
                  </a>
                </div>
              </div>

              <div className="relative ml-3 inline-block text-left sm:d-none">
                <div onClick={handleAvatarClick}>
                  <Avatar
                    imageUrl="https://e1.pxfuel.com/desktop-wallpaper/189/133/desktop-wallpaper-pin-on-graphy-smart-boy-cartoon.jpg"
                    altText="Photo"
                  />
                </div>

                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#53BD70] hover:text-white"
                        role="menuitem"
                      >
                        {user?.name}
                      </a>
                      <Link
                        to="/setting"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#53BD70] hover:text-white"
                        role="menuitem"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignout}
                        className="flex px-4 py-2 w-full text-sm text-gray-700 hover:bg-[#53BD70] hover:text-white justify-start"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;
