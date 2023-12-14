import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Button, Card, Modal, Space, Spin } from 'antd';
import { DeleteOutlined, PrinterOutlined } from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import moment from 'moment';
import PdfPrint from './PdfPrint';
import {
  useDeleteInvoiceMutation,
  useGetAllInvoicesQuery,
} from '../../redux/features/invoice/invoiceSlice';

interface InvoiceClient {
  name: string;
  email: string;
  mobile: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
  users?: string; // Optional, adjust as needed
}

interface InvoiceService {
  serviceName: string;
  quantity: number;
  price: number;
  amount: number;
  description: string;
  _id: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  client: InvoiceClient;
  billBy: InvoiceClient;
  services: InvoiceService[];
  totalAmount: number;
  paymentStatus: string;
  users: string;
  dateIssue: string; // Change this to moment.Moment if it's a moment object
  dateDue: string; // Change this to moment.Moment if it's a moment object
  notes: string;
  trash: boolean;
  createdAt: string; // Change this to moment.Moment if it's a moment object
  updatedAt: string; // Change this to moment.Moment if it's a moment object
  __v: number;
}

interface InvoiceValues {
  invoiceNumber: string;
  _id: string;
  date: moment.Moment;
  dateDue: moment.Moment;
  name: string;
  email: string;
  address: string;
  services: Array<{
    key: string;
    name: string;
    service: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
  }>;
  note: string;
}

const Invoice: React.FC = () => {
  const { data, isLoading, isError } = useGetAllInvoicesQuery('ok');
  console.log(data);

  const [deleteInvoice] = useDeleteInvoiceMutation();
  const [printData, setPrintData] = useState<InvoiceValues | null>(null);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handlePdfPrint = (row: InvoiceValues) => {
    const pd = data?.filter((d: InvoiceValues) => d._id === row._id);
    const pdata = pd[0];
    setPrintData(pdata);

    setTimeout(() => {
      handlePrint();
    }, 50);
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this setting?',
      onOk: async () => {
        try {
          await deleteInvoice(id);
        } catch (error) {
          console.error('Error deleting setting:', error);
        }
      },
      onCancel: () => {},
      okButtonProps: {
        style: {
          backgroundColor: '#ff0000',
        },
      },
    });
  };

  const columns = [
    {
      title: 'Invoice Number',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: 'Client Name',
      dataIndex: ['client', 'name'],
      key: 'clientName',
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      render: (services: any) => (
        <ul>
          {services.map((service: any) => (
            <li key={service._id} className="flex flex-col gap-2">
              <div>
                <span>
                  <strong>Name:</strong>
                  {service.serviceName}
                </span>
              </div>
              {/* Add more details or customize as needed */}
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Action',
      dataIndex: '_id',
      key: 'action',
      render: (_: string, row: InvoiceValues) => (
        <Space>
          <Button
            type="primary"
            className="bg-red-500"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(row._id)}
          ></Button>{' '}
          <Button
            type="primary"
            onClick={() => handlePdfPrint(row)}
            icon={<PrinterOutlined />}
            className="text-white flex justify-center items-center bg-[#53BD70] hover:bg-[#53BD70] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-[#5ada7c] dark:hover:bg-[#53BD70] dark:focus:ring-[#53BD70]"
          ></Button>
        </Space>
      ),
    },
  ];
  const summary = () => (
    <Link
      to="/add-invoice"
      className="text-white max-w-[250px] flex justify-center items-center bg-[#53BD70] hover:bg-[#53BD70] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-[#53BD70]"
    >
      Add new invoice
    </Link>
  );
  return (
    <>
      <div className="bg-[#5E72E4] h-screen pt-5 p-4">
        <div className="">
          {isLoading ? (
            <Spin />
          ) : isError ? (
            <div className="bg-[#5E72E4] h-screen w-full">
              <Card className="">
                <div className="flex justify-center h-[500px] items-center">
                  <h1 className="text-2xl font-bold">
                    This user has no invoice data
                  </h1>
                </div>
              </Card>
            </div>
          ) : (
            <Table
              dataSource={data}
              columns={columns}
              loading={isLoading}
              title={summary}
              pagination={{ pageSize: 10 }}
            />
          )}
        </div>
      </div>
      <div className="hidden">
        {printData && (
          <>
            <PdfPrint pdfData={printData} refC={componentRef} />
          </>
        )}
      </div>
    </>
  );
};

export default Invoice;
