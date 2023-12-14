import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
import { useUpdateSettingMutation } from '../../redux/features/setting/settingSlice';

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
  ud?: FormDataProps | null;
}

const SettingUpdate: React.FC<CreateAppSettingProps> = ({
  openm,
  setOpen,
  ud,
}) => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateSetting] = useUpdateSettingMutation();
  console.log(file);
  const updateData = Array.isArray(ud) && ud.length > 0 ? ud[0] : null;

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
      // Type assertion to treat file as string or object with uid
      let publicId: string;
      if ((file as any).uid) {
        publicId = (file as any).uid.split('.')[0];
      } else {
        publicId = (file as string).split('.')[0];
      }
      console.log(publicId);

      // Check the API endpoint and method
      const apiUrl = 'http://localhost:5050/api/v1/setting/idc';

      // Use const for publicId
      const response = await axios.post(apiUrl, {
        publicId,
      });

      // Handle the response if needed
      console.log(response.data);

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
    await updateSetting({ data: values, id: updateData._id });
    console.log(values);
    handleCancel(); // Add parentheses to call the function
  };

  const defaultValues = useMemo(() => {
    if (updateData) {
      setFile(updateData.logo);
    }
    return {
      favicon: updateData ? updateData.favicon : undefined,
      title: updateData ? updateData.title : undefined,
    };
  }, [updateData]);

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [form, defaultValues]);

  const handleOk = () => {
    setOpen((p: any) => ({
      ...p,
      updateS: true,
    }));
  };

  const handleCancel = () => {
    setOpen((p: any) => ({
      ...p,
      updateS: false,
    }));
  };
  return (
    <Modal
      title="Setting Update Modal"
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
              <Image
                src={file.url ? file.url : file}
                alt="Photo"
                width={150}
                height={150}
              />
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
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SettingUpdate;
