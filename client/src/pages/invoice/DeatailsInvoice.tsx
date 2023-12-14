import { Button, Card } from 'antd';
import logo from '../../assets/invoices.png';
import { useReactToPrint } from 'react-to-print';
import { useRef } from 'react';
import { PrinterOutlined } from '@ant-design/icons';

const DeatailsInvoice: React.FC = () => {
  // Sample dynamic data
  const pdfData = {
    dateIssue: new Date(),
    dateDue: new Date(),
    invoiceNumber: 'INV123',
    client: {
      name: 'Md Kayda Azam',
      email: 'mdkaydaazam1@gmail.com',
      mobile: '+1 (123) 456 7890',
      city: 'Anytown',
      country: 'USA',
      street: '123 Main St.',
      zipCode: '12345',
    },
    billBy: {
      name: 'Achem',
      email: 'achem@gmail.com',
      mobile: '+1 (987) 654 3210',
      city: 'Another Town',
      country: 'USA',
      street: '456 Oak St.',
      zipCode: '54321',
    },
    services: [
      {
        serviceName: 'Service 1',
        description: 'Description of Service 1',
        quantity: 2,
        price: 50.0,
        amount: 100.0,
      },
      {
        serviceName: 'Service 2',
        description: 'Description of Service 2',
        quantity: 3,
        price: 75.0,
        amount: 225.0,
      },
      // Add more services as needed
    ],
    totalAmount: 325.0,
    dueBalance: 325.0,
    paymentStatus: 'Pending',
    notes: 'Additional notes or comments...',
  };

  const componentRef = useRef<HTMLDivElement>(null);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div className="bg-[#5E72E4] w-full flex justify-center items-center   pt-5 p-4">
      <div className="w-[1100px]">
        <Card title="Setting Update Forms">
          <div
            ref={componentRef}
            className="bg-white rounded-lg shadow-lg px-8 py-10 max-w-[1000px] mx-auto text-[#818E9B]"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="">
                <div className="flex items-center">
                  <img className="h-8 w-8 mr-2" src={logo} alt="Logo" />
                  <div className=" font-semibold text-lg">Invoice</div>
                </div>
                <div className="address mt-5">
                  <p>Office: 149, 450 South Brand Brooklyn San Diego</p>
                  <p> County: CA 91905, USA</p>
                  <p>Phone: +1 (123) 456 7891, +44 (876) 543 2198</p>
                </div>{' '}
              </div>

              <div className="">
                <div className="font-bold text-xl mb-2">INVOICE</div>
                <div className="text-sm">
                  Date issue: {pdfData?.dateIssue.toLocaleDateString()}
                </div>
                <div className="text-sm">
                  Date due: {pdfData?.dateDue.toLocaleDateString()}
                </div>

                <div className="text-sm">
                  Invoice #: {pdfData?.invoiceNumber}
                </div>
              </div>
            </div>
            <div className="flex justify-between border-b-2 border-gray-300  pb-8 mb-8">
              <div className="">
                <h2 className="text-2xl font-bold mb-4">Client To:</h2>
                <div className=" mb-2">
                  <strong>Name:</strong> {pdfData?.client?.name}
                </div>
                <div className=" mb-2">
                  <strong>Email:</strong> {pdfData?.client?.email}
                </div>
                <div className=" mb-2">
                  <strong>Phone:</strong> {pdfData?.client?.mobile}
                </div>
                <div className=" mb-2">
                  <strong>City:</strong> {pdfData?.client?.city}
                </div>
                <div className=" mb-2">
                  <strong>Country:</strong> {pdfData?.client?.country}
                </div>
                <div className=" mb-2">
                  <strong>Street:</strong> {pdfData?.client?.street}
                </div>
                <div className=" mb-2">
                  <strong>Zipcode:</strong> {pdfData?.client?.zipCode}
                </div>
              </div>{' '}
              <div className="s">
                <h2 className="text-2xl font-bold mb-4">Bill By:</h2>
                <div className=" mb-2">
                  <strong>Name:</strong> {pdfData?.billBy?.name}
                </div>
                <div className=" mb-2">
                  <strong>Email:</strong> {pdfData?.billBy?.email}
                </div>
                <div className=" mb-2">
                  <strong>Phone:</strong> {pdfData?.billBy?.mobile}
                </div>
                <div className=" mb-2">
                  <strong>City:</strong> {pdfData?.billBy?.city}
                </div>
                <div className=" mb-2">
                  <strong>Country:</strong> {pdfData?.billBy?.country}
                </div>
                <div className=" mb-2">
                  <strong>Street:</strong> {pdfData?.billBy?.street}
                </div>
                <div className=" mb-2">
                  <strong>Zipcode:</strong> {pdfData?.billBy?.zipCode}
                </div>
              </div>
            </div>
            <table className="w-full text-left mb-8">
              <thead>
                <tr>
                  <th className=" font-bold uppercase py-2">Services</th>
                  <th className=" font-bold uppercase py-2">Description</th>
                  <th className=" font-bold uppercase py-2">QTY</th>
                  <th className=" font-bold uppercase py-2">Price</th>
                  <th className=" font-bold uppercase py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {pdfData.services &&
                  pdfData?.services?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td className="py-4 ">{data?.serviceName}</td>
                        <td className="py-4 max-w-[200px]">
                          {data?.description}
                        </td>
                        <td className="py-4 ">{data?.quantity}</td>
                        <td className="py-4 ">{data?.price}</td>
                        <td className="py-4 ">{data?.amount}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            <div className="flex justify-end mb-8">
              <div className=" mr-2 text-xl text-bold">Total:</div>
              <div className="">${pdfData?.totalAmount}</div>
            </div>{' '}
            <div className="flex justify-end mb-8">
              <div className=" mr-2 text-xl text-bold">Due Balance:</div>
              <div className="">${pdfData?.dueBalance}</div>
            </div>{' '}
            <div className="flex justify-end mb-8">
              <div className=" mr-2 text-xl text-bold">Payment Status:</div>
              <div className="">{pdfData?.paymentStatus}</div>
            </div>{' '}
            <div className="border-t-2 border-gray-300 pt-8 mb-8">
              <h2>Notes :</h2>
              <p className="mb-10">{pdfData?.notes}</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-5 ">
            <Button
              type="primary"
              onClick={pdfData ? handlePrint : undefined}
              icon={<PrinterOutlined />}
              className="text-white flex justify-center items-center bg-[#53BD70] hover:bg-[#53BD70] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-[#5ada7c] dark:hover:bg-[#53BD70] dark:focus:ring-[#53BD70]"
            >
              Print
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeatailsInvoice;
