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
  Card,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { UploadFile } from 'antd/lib/upload/interface';
import {
  useGetAllSettingsQuery,
  useUpdateSettingMutation,
} from '../../redux/features/setting/settingSlice';
import { useNavigate } from 'react-router-dom';

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

const SettingUpdate: React.FC<FormDataProps> = () => {
  const navigate = useNavigate();
  const { data } = useGetAllSettingsQuery('ok');
  const ud = data;
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [updateSetting] = useUpdateSettingMutation();
  console.log(logoFile);

  const customRequest = async (
    { file, onSuccess, onError }: any,
    fieldName: string
  ) => {
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
      form.setFields([{ name: [fieldName], value: response.data.secure_url }]);

      if (fieldName === 'logo') {
        setLogoFile({
          uid: response.data.public_id,
          name: file.name,
          status: 'done',
          url: response.data.secure_url,
        });
      } else if (fieldName === 'favicon') {
        setFaviconFile({
          uid: response.data.public_id,
          name: file.name,
          status: 'done',
          url: response.data.secure_url,
        });
      }

      message.success(`${file.name} file uploaded successfully.`);
    } catch (error) {
      onError();
      message.error(`${file.name} file upload failed.`);
      console.error('Error uploading image to Cloudinary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (fieldName: string, file: any) => {
    if (!file) {
      return;
    }

    setLoading(true);

    try {
      let publicId: string;
      if (file.uid) {
        publicId = file.uid.split('.')[0];
      } else {
        publicId = file.split('.')[0];
      }

      const apiUrl = 'http://localhost:5050/api/v1/setting/idc';

      const response = await axios.post(apiUrl, {
        publicId,
      });

      console.log(response.data);

      if (fieldName === 'logo') {
        setLogoFile(null);
      } else if (fieldName === 'favicon') {
        setFaviconFile(null);
      }

      message.success('Image deleted successfully.');
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      message.error('Failed to delete image.');
    } finally {
      setLoading(false);
    }
  }, []);

  const beforeUpload = (newFile: File) => {
    const isImage = newFile.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    return isImage;
  };

  const onFinish = async (values: FormDataProps) => {
    await updateSetting({
      data: values,
      id: (ud && ud[0] && ud[0]._id) || undefined,
    });
    navigate('/');
  };

  const defaultValues = useMemo(() => {
    if (ud && ud.length > 0) {
      setLogoFile({ url: ud[0].logo });
      setFaviconFile({ url: ud[0].favicon });
    }
    return {
      favicon: ud ? ud[0].favicon : undefined,
      title: ud ? ud[0].title : undefined,
    };
  }, [ud]);

  useEffect(() => {
    form.setFieldsValue(defaultValues);
  }, [form, defaultValues]);

  return (
    <div className="bg-[#5E72E4] dark:bg-black w-full flex justify-center items-center   pt-5 p-4">
      <div className="w-[1100px]">
        <Card title="Setting Update Forms">
          <Form form={form} onFinish={onFinish} layout="vertical">
            <Form.Item label="Upload Logo" name="logo">
              <Upload
                customRequest={(fileProps) => customRequest(fileProps, 'logo')}
                beforeUpload={beforeUpload}
                showUploadList={false}
                fileList={
                  logoFile ? [logoFile] : ([] as UploadFile<FileItem>[])
                }
                listType="picture-card"
                onPreview={() => window.open(logoFile?.url, '_blank')}
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
              {logoFile && (
                <div>
                  <Image
                    src={logoFile.url ? logoFile.url : logoFile}
                    alt="Logo"
                    width={150}
                    height={150}
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this logo?"
                    onConfirm={() => handleDelete('logo', logoFile)}
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
            <Form.Item label="Upload Favicon" name="favicon">
              <Upload
                customRequest={(fileProps) =>
                  customRequest(fileProps, 'favicon')
                }
                beforeUpload={beforeUpload}
                showUploadList={false}
                fileList={
                  faviconFile ? [faviconFile] : ([] as UploadFile<FileItem>[])
                }
                listType="picture-card"
                onPreview={() => window.open(faviconFile?.url, '_blank')}
                maxCount={1}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              </Upload>
              {faviconFile && (
                <div>
                  <Image
                    src={faviconFile.url ? faviconFile.url : faviconFile}
                    alt="Favicon"
                    width={150}
                    height={150}
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this favicon?"
                    onConfirm={() => handleDelete('favicon', faviconFile)}
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
        </Card>
      </div>
    </div>
  );
};

export default SettingUpdate;
