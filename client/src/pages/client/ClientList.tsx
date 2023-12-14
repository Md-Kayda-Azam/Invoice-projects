import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Spin, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  useDeleteClientMutation,
  useGetAllClientsQuery,
  useUpdateClientMutation,
} from '../../redux/features/client/clientApiSlice';

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

const ClientList: React.FC = () => {
  const { data, isLoading, isError } = useGetAllClientsQuery('ok');
  const [deleteClient] = useDeleteClientMutation();
  const [updateClient] = useUpdateClientMutation();
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleEdit = (id: string) => {
    const updateData = data?.find((d: User) => d._id === id);
    setVisible(true);
    setUser(updateData || null);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this setting?',
      onOk: async () => {
        try {
          await deleteClient(id);
        } catch (error) {
          console.error('Error deleting setting:', error);
        }
      },
      onCancel: () => {
        // Handle cancellation
      },
      okButtonProps: {
        style: {
          backgroundColor: '#ff0000',
        },
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'index',
      key: 'index',
      sorter: (a: User, b: User) => a._id.localeCompare(b._id),
      render: (_: any, record: User, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: User, b: User) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      sorter: (a: User, b: User) => a.mobile.localeCompare(b.mobile),
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      sorter: (a: User, b: User) => a.country.localeCompare(b.country),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: User) => (
        <Space>
          <Button
            type="primary"
            className="bg-green-500"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record._id)}
          ></Button>
          <Button
            type="primary"
            className="bg-red-500"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          ></Button>{' '}
        </Space>
      ),
    },
  ];

  const onFinish = async (values: any) => {
    await updateClient({ data: values, id: values._id });
    setVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };
  return (
    <div className="bg-[#5E72E4] h-screen pt-5 p-4">
      <Modal
        visible={visible}
        title="Client Update"
        onCancel={onClose}
        footer={false}
      >
        <Form initialValues={user} layout="vertical" onFinish={onFinish}>
          <Form.Item name="_id" label="ID">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter an email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Mobile"
            rules={[
              { required: true, message: 'Please enter a mobile number' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: 'Please enter a country' }]}
          >
            <Input />
          </Form.Item>{' '}
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-green-500">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <div className="">
        <div className="">
          {isLoading ? (
            <Spin />
          ) : isError ? (
            <div className="bg-[#5E72E4] h-screen w-full">
              <Card className="">
                <div className="flex justify-center h-[500px] items-center">
                  <h1 className="text-2xl font-bold">
                    This user has no client data
                  </h1>
                </div>
              </Card>
            </div>
          ) : (
            <Table
              dataSource={data}
              columns={columns}
              loading={isLoading}
              className="custom-table"
              title={(record) => `Total Clients : ${record.length}`}
              pagination={{ pageSize: 10 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientList;
