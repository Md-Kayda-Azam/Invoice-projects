import { RefObject } from 'react';
import logo from '../../assets/invoices.png';

interface Address {
  city: string;
  country: string;
  street: string;
  zipCode: string;
}

interface InvoiceClient extends Address {
  name: string;
  email: string;
  mobile: string;
}

interface InvoiceService {
  serviceName: string;
  quantity: number;
  price: number;
  amount: number;
  description: string;
  _id: string;
}

interface InvoiceValues {
  invoiceNumber: string;
  id: string;
  date: string;
  dateDue: string;
  name: string;
  email: string;
  address: Address;
  services: InvoiceService[];
  note: string;
  client: InvoiceClient;
  billBy: InvoiceClient;
  totalAmount: number;
  dueBalance: number;
  paymentStatus: string;
}

const InvoicePdf: React.FC<{
  pdfData: InvoiceValues;
  refC: string | RefObject<HTMLDivElement>;
}> = ({ pdfData, refC }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <>
      <div
        ref={refC}
        className="bg-white rounded-lg shadow-lg px-8 py-10 max-w-[1000px] mx-auto text-[#818E9B]"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="">
            <div className="flex items-center">
              <img className="h-8 w-8 mr-2" src={logo} alt="Logo" />
              <div className=" font-semibold text-lg">Your Company Name</div>
            </div>
            <div className="address mt-5">
              <p>Office: 149, 450 South Brand Brooklyn San Diego</p>
              <p> County: CA 91905, USA</p>
              <p>Phone: +1 (123) 456 7891, +44 (876) 543 2198</p>
            </div>
          </div>

          <div className="">
            <div className="font-bold text-xl mb-2">INVOICE</div>
            <div className="text-sm">
              Date issue: {formatDate(pdfData?.date)}
            </div>
            <div className="text-sm">
              Date due:{formatDate(pdfData?.dateDue)}
            </div>
            <div className="text-sm">Invoice #: {pdfData?.invoiceNumber}</div>
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
                    <td className="py-4 max-w-[200px]">{data?.description}</td>
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
          <p className="mb-10">{pdfData?.note}</p>
        </div>
      </div>
    </>
  );
};

export default InvoicePdf;
