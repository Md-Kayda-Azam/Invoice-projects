// src/App.tsx
import { Table, Button, Popconfirm, Card } from 'antd';
import React from 'react';
import {
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
// Define the User type
type User = {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  users: string[];
  trash: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
import { BarChart } from 'keep-react';
import { useGetAllInvoicesQuery } from '../../redux/features/invoice/invoiceSlice';
import { useGetAllUsersQuery } from '../../redux/features/user/userSlice';
import { useGetAllClientsQuery } from '../../redux/features/client/clientApiSlice';

// Sample data for demonstration
const users: User[] = Array.from({ length: 50 }, (_, index) => ({
  _id: `${index + 1}`,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  mobile: `123456789${index}`,
  country: 'Country',
  users: [],
  trash: false,
  createdAt: '2023-01-01',
  updatedAt: '2023-01-02',
  __v: 0,
}));
const Dashboard: React.FC = () => {
  const { data: invoicesData } = useGetAllInvoicesQuery('ok');
  const { data: usersData } = useGetAllUsersQuery('ok');
  const { data: clientsData } = useGetAllClientsQuery('ok');
  const invoicesLength = invoicesData ? invoicesData.length : 0;
  const totalInvoiceAmount = invoicesData
    ? invoicesData.reduce(
        (total: number, invoice: any) => total + invoice.totalAmount,
        0
      )
    : 0;
  const usersLength = usersData ? usersData.length : 0;
  const clientsLength = clientsData ? clientsData.length : 0;

  const totalItems = 100;
  const invoicesPercentage = (invoicesLength / totalItems) * 100;
  const usersPercentage = (usersLength / totalItems) * 100;
  const clientsPercentage = (clientsLength / totalItems) * 100;

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },

    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: User) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            className="bg-green-500"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            View
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Dummy functions for action handlers
  const handleEdit = (record: User) => {
    console.log('Edit:', record);
  };

  const handleView = (record: User) => {
    console.log('View:', record);
  };

  const handleDelete = (userId: string) => {
    console.log('Delete:', userId);
  };

  const BarChartData =
    invoicesData?.map((invoice: any) => ({
      name: invoice.invoiceNumber, // Use a relevant identifier for each invoice
      AmountPaid: invoice.amountPaid,
      DueBalance: invoice.dueBalance,
    })) || [];
  return (
    <div className="p-4 dark:bg-black bg-[#5E72E4] h-full">
      <div className="flex flex-wrap -mx-3">
        <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans font-semibold leading-normal uppercase dark:text-white dark:opacity-60 text-sm">
                      Total Invoices
                    </p>
                    <h5 className="mb-2 font-bold dark:text-white">
                      {invoicesLength}
                    </h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="font-bold leading-normal text-sm text-emerald-500">
                        +{invoicesPercentage}%
                      </span>
                      since yesterday
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500">
                    <DollarCircleOutlined className="text-lg relative top-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans font-semibold leading-normal uppercase dark:text-white dark:opacity-60 text-sm">
                      Total Users
                    </p>
                    <h5 className="mb-2 font-bold dark:text-white">
                      {' '}
                      {usersLength ? usersLength : 0}
                    </h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="font-bold leading-normal text-sm text-emerald-500">
                        +{usersPercentage ? usersPercentage : 0}%
                      </span>{' '}
                      Since last week
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-red-600 to-orange-600">
                    <EnvironmentOutlined className="text-lg relative top-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans font-semibold leading-normal uppercase dark:text-white dark:opacity-60 text-sm">
                      Total Clients
                    </p>
                    <h5 className="mb-2 font-bold dark:text-white">
                      {clientsLength}
                    </h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="font-bold leading-normal text-red-600 text-sm">
                        -{clientsPercentage}%
                      </span>
                      since last quarter
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-emerald-500 to-teal-400">
                    <FileTextOutlined className="text-lg relative top-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full max-w-full px-3 sm:w-1/2 sm:flex-none xl:w-1/4">
          <div className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
            <div className="flex-auto p-4">
              <div className="flex flex-row -mx-3">
                <div className="flex-none w-2/3 max-w-full px-3">
                  <div>
                    <p className="mb-0 font-sans font-semibold leading-normal uppercase dark:text-white dark:opacity-60 text-sm">
                      Total Sales
                    </p>
                    <h5 className="mb-2 font-bold dark:text-white">
                      ${totalInvoiceAmount}
                    </h5>
                    <p className="mb-0 dark:text-white dark:opacity-60">
                      <span className="font-bold leading-normal text-sm text-emerald-500">
                        +5%
                      </span>
                      than last month
                    </p>
                  </div>
                </div>
                <div className="px-3 text-right basis-1/3">
                  <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-orange-500 to-yellow-500">
                    <ShoppingCartOutlined className="ni ni-cart text-lg relative top-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-full mt-5 ">
        <Card>
          <BarChart
            height={300}
            width={1100}
            active
            activeIndex={5}
            dataKey="AmountPaid"
            chartData={BarChartData}
            barRadius={[4, 4, 0, 0]}
            showLegend={true}
            showBg={true}
            showXaxis={true}
            showYaxis={true}
            showTooltip={true}
            secondaryDataKey="DueBalance"
          />
        </Card>
      </div>
      <div className="mt-5">
        <Table
          dataSource={usersData ? usersData : 0}
          columns={columns}
          className=""
          title={() => 'User All Data'}
        />
      </div>
    </div>
  );
};

export default Dashboard;
