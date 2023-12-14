import { Form, Input, Button, message } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSigninUserMutation } from '../../redux/features/auth/authSlice.ts';

interface SignInFormValues {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [signinUser, { isLoading }] = useSigninUserMutation();

  const onFinish = async (values: SignInFormValues) => {
    try {
      // Call the signup mutation
      await signinUser(values).unwrap();

      // Handle successful signup
      message.success('Signup successful!');
      navigate('/'); // Redirect to the login page
    } catch (error) {
      // Handle signup error
      message.error('Signup failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-3xl w-50 max-w-md">
          <div className="font-medium self-center text-xl sm:text-3xl text-gray-800">
            Sign In
          </div>
          <div className="mt-4 self-center text-xl sm:text-sm text-gray-800">
            Enter your credentials to get access account
          </div>
          <div className="mt-10">
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Email is required' },
                  { type: 'email', message: 'Please enter a valid email' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Email"
                  className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-2xl border w-full py-2 focus:outline-none"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Password is required' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  placeholder="Password"
                  className="text-sm placeholder-gray-500 pl-10 pr-4 rounded-2xl border w-full py-2 focus:outline-none"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  loading={isLoading}
                  className=" flex justify-center items-center h-10 font-bold w-full text-white hover:text-white bg-[#53BD70] text-sm placeholder-gray-500 pl-10 pr-4 rounded-2xl border py-2 focus:outline-none"
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className="flex justify-center items-center mt-6">
          <a
            href="#"
            target="_blank"
            className="inline-flex items-center text-gray-700 font-medium text-xs text-center"
          >
            <span className="ml-2">Create new account?</span>
          </a>
          <Link
            to="/signup"
            className="text-xs ml-2 text-[#339CCB] font-semibold"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
