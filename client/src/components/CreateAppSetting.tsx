import React, { useState, useCallback } from 'react';
import {
  Form,
  Upload,
  message,
  Button,
  Spin,
  Popconfirm,
  Image,
  Input,
  Modal,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UploadFile } from 'antd/lib/upload/interface';
import { useCreateSettingMutation } from '../redux/features/setting/settingSlice';

interface FileItem {
  uid: string;
  name: string;
  status?: 'done' | 'uploading' | 'error' | 'removed';
  url: string;
}
interface FormDataProps {
  logo: string;
  favicon: string;
  title: string;
}
interface CreateAppSettingProps {
  openm: boolean;
  setOpen: React.Dispatch<
    React.SetStateAction<{
      createS: boolean;
      updateS: boolean;
    }>
  >;
}

const CreateAppSetting: React.FC<CreateAppSettingProps> = ({
  openm,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [createSetting] = useCreateSettingMutation();
  const [file, setFile] = useState<FileItem | null>(null);
  const [loading, setLoading] = useState(false);

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    setLoading(true);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'front-endimageupload'); // Replace with your Cloudinary preset

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dhj6mwqcf/image/upload',
        data
      );

      onSuccess();
      form.setFields([{ name: ['logo'], value: response.data.secure_url }]);

      setFile({
        uid: response.data.public_id,
        name: file.name,
        status: 'done',
        url: response.data.secure_url,
      });

      message.success(`${file.name} file uploaded successfully.`);
    } catch (error) {
      onError();
      message.error(`${file.name} file upload failed.`);
      console.error('Error uploading image to Cloudinary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async () => {
    if (!file) {
      return;
    }

    setLoading(true);

    try {
      // Handle deletion on Cloudinary
      const publicId = file.uid.split('.')[0];

      await axios.post('http://localhost:5050/api/v1/setting/idc', {
        publicId,
      });

      setFile(null);
      message.success('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      message.error('Failed to delete image.');
    } finally {
      setLoading(false);
    }
  }, [file]);

  const beforeUpload = (newFile: File) => {
    const isImage = newFile.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const onFinish = async (values: FormDataProps) => {
    await createSetting(values);
    setOpen((p) => ({
      ...p,
      createS: false,
    }));
    form.resetFields();
    setFile(null);
  };
  const handleOk = () => {
    setOpen((p) => ({
      ...p,
      createS: true,
    }));
  };

  const handleCancel = () => {
    setOpen((p) => ({
      ...p,
      createS: false,
    }));
  };
  return (
    <Modal
      title="Setting Create Modal"
      open={openm}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={false}
    >
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Upload Image" name="logo">
          <Upload
            customRequest={customRequest}
            beforeUpload={beforeUpload}
            showUploadList={false}
            fileList={file ? [file] : ([] as UploadFile<FileItem>[])}
            listType="picture-card"
            onPreview={() => window.open(file?.url, '_blank')}
            maxCount={1}
          >
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
          {file && (
            <div>
              <Image src={file.url} alt="Photo" width={150} height={150} />
              <Popconfirm
                title="Are you sure you want to delete this image?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                placement="bottomRight"
              >
                {loading ? (
                  <Spin size="large" />
                ) : (
                  <Button
                    icon={<DeleteOutlined />}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      background: 'rgba(255, 255, 255, 0.8)',
                    }}
                  />
                )}
              </Popconfirm>
            </div>
          )}
        </Form.Item>
        <Form.Item
          label="Favicon"
          name="favicon"
          rules={[{ required: true, message: 'Please enter the favicon URL!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="bg-green-500">
            Create
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAppSetting;
