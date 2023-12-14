import ClientList from '../pages/client/ClientList';
import Dashboard from '../pages/dashboard/Dashboard';
import CreateInvoice from '../pages/invoice/CreateInvoice';
import DeatailsInvoice from '../pages/invoice/DeatailsInvoice';
import Invoice from '../pages/invoice/Invoice';
import Layout from '../pages/layout/Layout';
import Setting from '../pages/setting/Setting';
import PrivateGard from './privateGard';

// create private route
const privateRoute = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        element: <PrivateGard />,
        children: [
          {
            path: '/',
            element: <Dashboard />,
          },
          {
            path: '/client',
            element: <ClientList />,
          },
          {
            path: '/all-invoice',
            element: <Invoice />,
          },
          {
            path: '/add-invoice',
            element: <CreateInvoice />,
          },
          {
            path: '/invoice-details',
            element: <DeatailsInvoice />,
          },
          {
            path: '/setting',
            element: <Setting />,
          },
        ],
      },
    ],
  },
];

// export default

export default privateRoute;
