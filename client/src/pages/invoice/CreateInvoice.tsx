import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, DatePicker, Select, Card } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import logo from '../../assets/invoices.png';

import moment from 'moment';
import { FieldData } from 'rc-field-form/lib/interface';
const { TextArea } = Input;
const { Option } = Select;
import type { FormItemProps } from 'antd';
import { useCreateInvoiceMutation } from '../../redux/features/invoice/invoiceSlice.ts';
import PdfPrint from './PdfPrint';

import { useReactToPrint } from 'react-to-print';
import { useNavigate } from 'react-router-dom';

// form item context
const MyFormItemContext = React.createContext<(string | number)[]>([]);

// form item froup props interface
interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
  children: React.ReactNode;
}

/// to array function
function toArr(
  str: string | number | (string | number)[]
): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

// form group item function
const MyFormItemGroup = ({ prefix, children }: MyFormItemGroupProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix]
  );

  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};

// form item function
const MyFormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};

// invoice values interface
interface InvoiceValues {
  invoiceNumber: string;
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

const CreateInvoice: React.FC = () => {
  const nagivate = useNavigate();
  const [form] = Form.useForm<InvoiceValues>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [createInvoice] = useCreateInvoiceMutation();
  const [pdfData, setPdfData] = useState<InvoiceValues | null>(null);

  // form onfinish data functions
  const onFinish = async (values: InvoiceValues) => {
    try {
      const result = await createInvoice(values);

      // Check if the result has a 'data' property
      if ('data' in result) {
        const invoiceData: InvoiceValues = result.data;
        nagivate('/all-invoice');
        console.log('Received values:', invoiceData);
      } else {
        console.log('Form Submit Failed!');
      }
    } catch (err) {
      console.log('Error:', err);
    }
  };

  // Calculate the amount based on quantity and price
  const calculateAmount = useCallback(
    (index: number) => {
      const quantity = form.getFieldValue(['services', index, 'quantity']);
      const price = form.getFieldValue(['services', index, 'price']);
      const amount = quantity * price;

      const newValues = [...form.getFieldValue('services')];
      newValues[index] = {
        ...newValues[index],
        amount,
      };

      form.setFields([{ name: ['services'], value: newValues }]);
    },
    [form]
  );

  const handleFieldsChange = (
    changedFields: FieldData[],
    allFields: FieldData[]
  ) => {
    const servicesField = allFields.find(
      (field) => field.name[0] === 'services'
    );

    if (servicesField && Array.isArray(servicesField.value)) {
      let total = 0;

      servicesField.value.forEach((service, index: number) => {
        calculateAmount(index);
        total += form.getFieldValue(['services', index, 'amount']);
      });
      form.setFields([{ name: ['totalAmount'], value: total }]);
      setTotalAmount(total);
    }
  };

  // this is a useeffect
  useEffect(() => {
    const services = form.getFieldsValue().services;

    if (services) {
      let total = 0;
      services.forEach((service, index) => {
        calculateAmount(index);
        total += form.getFieldValue(['services', index, 'amount']);
      });
      console.log(total);
      form.setFields([{ name: ['totalAmount'], value: total }]);

      setTotalAmount(total);
    }
  }, [calculateAmount, form]);

  const componentRef = useRef<HTMLDivElement>(null);

  // Function to handle printing
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [dueBalance, setDueBalance] = useState<number>(0);

  const handleAmountPaid = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountPaid = parseFloat(e.target.value) || 0; // Assuming the input is a number

    // Assuming totalAmount is also a state or a constant
    const newDueBalance = totalAmount - amountPaid;

    setDueBalance(newDueBalance);
    form.setFields([{ name: ['amountPaid'], value: amountPaid }]);
    form.setFields([{ name: ['dueBalance'], value: newDueBalance }]);
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setPdfData(allValues);
  };

  return (
    <div className="bg-[#5E72E4] w-full flex justify-center items-center   pt-5 p-4">
      <div className="w-[1100px]">
        <Card title="Setting Update Forms">
          <Form
            onFinish={onFinish}
            form={form}
            initialValues={{ remember: true }}
            onValuesChange={handleValuesChange}
            onFieldsChange={handleFieldsChange}
          >
            <div className="grid gap-6 mb-6 lg:grid-cols-2">
              <div>
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
              <div className="flex flex-col gap-3 mt-5 max-w-full justify-start">
                <div className="flex-row flex max-w-full justify-end gap-5">
                  <label
                    htmlFor="company"
                    className="block  text-xl font-bold text-gray-900 dark:text-gray-300"
                  >
                    <strong>Invoice</strong>
                  </label>
                  <Form.Item
                    name="invoiceNumber"
                    rules={[
                      {
                        required: true,
                        message: 'Missing is invoice-number',
                      },
                    ]}
                  >
                    <Input name="invoice-number" placeholder="#46338" />
                  </Form.Item>
                </div>{' '}
                <div className="flex-row flex max-w-full justify-end gap-5">
                  <label
                    htmlFor="company"
                    className="block  text-md font-semibold text-gray-900 dark:text-gray-300"
                  >
                    <span>Date Issued:</span>
                  </label>
                  <Form.Item
                    name="dateIssue"
                    rules={[
                      {
                        required: true,
                        message: 'Missing is date',
                      },
                    ]}
                  >
                    <DatePicker />
                  </Form.Item>
                </div>{' '}
                <div className="flex-row flex max-w-full justify-end gap-5">
                  <label
                    htmlFor="company"
                    className="block  text-md font-semibold text-gray-900 dark:text-gray-300"
                  >
                    <span>Date Due:</span>
                  </label>
                  <Form.Item
                    name="dateDue"
                    rules={[
                      {
                        required: true,
                        message: 'Missing is date-due',
                      },
                    ]}
                  >
                    <DatePicker />
                  </Form.Item>
                </div>{' '}
              </div>
              <MyFormItemGroup prefix={['client']}>
                <div>
                  <h2 className="text-2xl font-semibold ">Bill To:</h2>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="name">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Full Name:
                      </label>
                      <MyFormItem
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is name!',
                          },
                        ]}
                      >
                        <Input type="text" id="name" placeholder="name" />
                      </MyFormItem>
                    </div>
                    <div className="email">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Email:
                      </label>
                      <MyFormItem
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is email!',
                          },
                        ]}
                      >
                        <Input type="text" id="email" placeholder="email" />
                      </MyFormItem>
                    </div>{' '}
                    <div className="mobile">
                      <label
                        htmlFor="mobile"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Mobile:
                      </label>
                      <MyFormItem
                        name="mobile"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is mobile!',
                          },
                        ]}
                      >
                        <Input type="text" id="mobile" placeholder="mobile" />
                      </MyFormItem>
                    </div>
                    <div className="street">
                      <label
                        htmlFor="street"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Street :
                      </label>
                      <MyFormItem
                        name="street"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is street!s',
                          },
                        ]}
                      >
                        <Input type="text" id="street" placeholder="street" />
                      </MyFormItem>
                    </div>{' '}
                    <div className="city">
                      <label
                        htmlFor="city"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        City :
                      </label>
                      <MyFormItem
                        name="city"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is city!s',
                          },
                        ]}
                      >
                        <Input type="text" id="city" placeholder="city" />
                      </MyFormItem>
                    </div>{' '}
                    <div className="country">
                      <label
                        htmlFor="country"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Country :
                      </label>
                      <MyFormItem
                        name="country"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is country!s',
                          },
                        ]}
                      >
                        <Input type="text" id="country" placeholder="country" />
                      </MyFormItem>
                    </div>{' '}
                    <div className="zipCode">
                      <label
                        htmlFor="zipCode"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        ZipCode :
                      </label>
                      <MyFormItem
                        name="zipCode"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is zipCode!s',
                          },
                        ]}
                      >
                        <Input type="text" id="zipCode" placeholder="zipCode" />
                      </MyFormItem>
                    </div>
                  </div>
                </div>
              </MyFormItemGroup>
              <MyFormItemGroup prefix={['billBy']}>
                <div>
                  <h2 className="text-2xl font-semibold ">Bill By:</h2>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="name">
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Full Name:
                      </label>
                      <MyFormItem
                        name="name"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is name!',
                          },
                        ]}
                      >
                        <Input type="text" id="name" placeholder="name" />
                      </MyFormItem>
                    </div>
                    <div className="email">
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Email:
                      </label>
                      <MyFormItem
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is email!',
                          },
                        ]}
                      >
                        <Input type="text" id="email" placeholder="email" />
                      </MyFormItem>
                    </div>
                    <div className="mobile">
                      <label
                        htmlFor="mobile"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Mobile:
                      </label>
                      <MyFormItem
                        name="mobile"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is mobile!',
                          },
                        ]}
                      >
                        <Input type="text" id="mobile" placeholder="mobile" />
                      </MyFormItem>
                    </div>
                    <div className="street">
                      <label
                        htmlFor="street"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Street :
                      </label>
                      <MyFormItem
                        name="street"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is street!s',
                          },
                        ]}
                      >
                        <Input type="text" id="street" placeholder="street" />
                      </MyFormItem>
                    </div>{' '}
                    <div className="city">
                      <label
                        htmlFor="city"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        City :
                      </label>
                      <MyFormItem
                        name="city"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is city!s',
                          },
                        ]}
                      >
                        <Input type="text" id="city" placeholder="city" />
                      </MyFormItem>
                    </div>{' '}
                    <div className="country">
                      <label
                        htmlFor="country"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Country :
                      </label>
                      <MyFormItem
                        name="country"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is country!s',
                          },
                        ]}
                      >
                        <Input type="text" id="country" placeholder="country" />
                      </MyFormItem>
                    </div>{' '}
                    <div className="zipCode">
                      <label
                        htmlFor="zipCode"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        ZipCode :
                      </label>
                      <MyFormItem
                        name="zipCode"
                        rules={[
                          {
                            required: true,
                            message: 'Missing is zipCode!s',
                          },
                        ]}
                      >
                        <Input type="text" id="zipCode" placeholder="zipCode" />
                      </MyFormItem>
                    </div>
                  </div>
                </div>
              </MyFormItemGroup>
            </div>

            {/* {Item Code Under} */}
            <Form.List name="services">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div className="grid gap-6 mb-6 lg:grid-cols-2" key={key}>
                      <div>
                        <label
                          htmlFor="Item"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                        >
                          Service Name:
                        </label>
                        <div className="flex flex-col gap-3">
                          <Form.Item
                            {...restField}
                            name={[name, 'serviceName']}
                            rules={[
                              { required: true, message: 'Missing service' },
                            ]}
                          >
                            <Input placeholder="Enter your serviceName" />
                          </Form.Item>
                          <label
                            htmlFor="Item"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Description:
                          </label>
                          <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing description',
                              },
                            ]}
                          >
                            <TextArea
                              name=""
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              id=""
                              cols={30}
                              rows={3}
                              placeholder="Enter description"
                            ></TextArea>
                          </Form.Item>
                        </div>
                      </div>
                      <div className="flex flex-row justify-between gap-4">
                        <div className="quantity">
                          <label
                            htmlFor="cost"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Quantity:
                          </label>
                          <Form.Item
                            {...restField}
                            name={[name, 'quantity']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing quantity',
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              id="quantity"
                              placeholder="Quantity"
                              onChange={() => calculateAmount(index)}
                            />
                          </Form.Item>
                        </div>
                        <div className="price">
                          <label
                            htmlFor="hours"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Price:
                          </label>
                          <Form.Item
                            {...restField}
                            name={[name, 'price']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing price',
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              id="price"
                              placeholder="Price"
                              onChange={() => calculateAmount(index)}
                            />
                          </Form.Item>
                        </div>
                        <div className="amount">
                          <label
                            htmlFor="price"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Amount
                          </label>
                          <Form.Item
                            {...restField}
                            name={[name, 'amount']}
                            rules={[
                              {
                                required: true,
                                message: 'Missing amount',
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              id="amount"
                              placeholder="Amount"
                              value={form.getFieldValue([
                                'services',
                                index,
                                'amount',
                              ])}
                            />
                          </Form.Item>
                        </div>
                        <Button
                          type="dashed"
                          onClick={() => remove(name)}
                          block
                          icon={<DeleteOutlined />}
                          className="text-white max-w-[40px] flex justify-center items-center bg-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-red-500 dark:hover:bg-red-500 dark:focus:ring-red-500"
                        />
                      </div>
                    </div>
                  ))}
                  <Form.Item className="max-w-[200px]">
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                      className="text-white flex justify-center items-center bg-[#53BD70] hover:bg-[#53BD70] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-[#5ada7c] dark:hover:bg-[#53BD70] dark:focus:ring-[#53BD70]"
                    >
                      Add Item
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <div className="mb-6 border-t-2 ">
              <div className="flex justify-end mb-8">
                <Form.Item name="totalAmount" className="hidden">
                  <Input type="number" id="amount" placeholder="Amount" />
                </Form.Item>
              </div>{' '}
              <div className="flex-row flex max-w-full justify-end gap-5">
                <label
                  htmlFor="amountPaid"
                  className="block  text-md font-semibold text-gray-900 dark:text-gray-300"
                >
                  <span>Total :</span>
                </label>
                <div className="mb-5">{`$${totalAmount.toFixed(2)}`}</div>
              </div>{' '}
              <div className="flex-row flex max-w-full justify-end gap-5">
                <label
                  htmlFor="amountPaid"
                  className="block  text-md font-semibold text-gray-900 dark:text-gray-300"
                >
                  <span>Amount Paid :</span>
                </label>
                <Form.Item name="amountPaid">
                  <Input
                    type="number"
                    id="amountPaid"
                    placeholder="Amount"
                    onChange={(e) => handleAmountPaid(e)}
                  />
                </Form.Item>
              </div>{' '}
              <div className="flex-row flex max-w-full justify-end gap-5">
                <label
                  htmlFor="dueBalance"
                  className="block  text-md font-semibold text-gray-900 dark:text-gray-300"
                >
                  <span>Due balance :</span>
                </label>
                <Form.Item name="dueBalance" initialValue={dueBalance}>
                  <Input
                    type="number"
                    id="dueBalance"
                    placeholder="Due balance"
                    readOnly
                  />
                </Form.Item>
              </div>
              <div className="flex-row flex max-w-full justify-end gap-5">
                <label
                  htmlFor="paymentStatus"
                  className="block  text-md font-semibold text-gray-900 dark:text-gray-300"
                >
                  <span>Payment Status:</span>
                </label>
                <Form.Item
                  name="paymentStatus"
                  rules={[
                    {
                      required: true,
                      message: 'Please select a payment method',
                    },
                  ]}
                >
                  <Select placeholder="--select--" className="max-w-[200px">
                    <Option value="Paid">Paid</Option>
                    <Option value="Unpaid">Unpaid</Option>
                    <Option value="Pending">Pending</Option>
                  </Select>
                </Form.Item>
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Note
              </label>
              <Form.Item
                name="notes"
                rules={[
                  {
                    required: true,
                    message: 'Missing is note',
                  },
                ]}
              >
                <TextArea
                  name=""
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  id=""
                  cols={30}
                  rows={3}
                  placeholder="Enter description"
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="text-white flex justify-center items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={pdfData ? handlePrint : undefined}
            className="text-white flex justify-center items-center bg-[#53BD70] hover:bg-[#53BD70] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm sm:w-auto px-5 py-2.5 text-center dark:bg-[#5ada7c] dark:hover:bg-[#53BD70] dark:focus:ring-[#53BD70]"
          >
            Print
          </Button>
          <div className="hidden">
            {pdfData && (
              <>
                <PdfPrint pdfData={pdfData} refC={componentRef} />
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateInvoice;
