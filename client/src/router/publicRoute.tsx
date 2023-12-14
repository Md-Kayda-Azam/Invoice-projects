import SignIn from '../pages/auth/SignIn';
import SignUp from '../pages/auth/SignUp';
import PublicGard from './publicGard';

// create public route
const publicRoute = [
  {
    element: <PublicGard />,
    children: [
      {
        path: '/signin',
        element: <SignIn />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
    ],
  },
];

// export default

export default publicRoute;
