import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native'; // Thêm CheckBox
import CheckBox from 'expo-checkbox';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../(redux)/authSlice';
import { GoogleSignin, statusCodes, isErrorWithCode, isSuccessResponse } from '@react-native-google-signin/google-signin';
import { domain } from '../../constants/Domain'; // Import domain

// Validation schema for the login form (accepting both email and username)
const LoginSchema = Yup.object().shape({
  emailOrUsername: Yup.string()
    .required('Email hoặc Tên đăng nhập là bắt buộc')
    .test('is-email', 'Email không hợp lệ', (value) => {
      if (value && value.includes('@')) {
        return Yup.string().email().isValidSync(value); // Check if email is valid
      }
      return true; // Consider username valid if it doesn't have '@'
    }),
  password: Yup.string().min(6, 'Mật khẩu quá ngắn').required('Mật khẩu là bắt buộc'),
});

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [rememberMe, setRememberMe] = useState(false); // Quản lý trạng thái remember me

  // Cấu hình Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '298267748915-97hhkdfm1l4h4uaed6cfri414p4c3no4.apps.googleusercontent.com', 
    });
  }, []);

  // Xử lý đăng nhập với Google One-Tap
  const handleGoogleLogin = async () => {
    try {
      console.log("Đang bắt đầu đăng nhập Google...");
      const response = await GoogleSignin.signIn();
  
      if (isSuccessResponse(response)) {
        console.log('Thông tin người dùng từ Google One-Tap:', response.data);
  
        // Gửi idToken đến backend để xác thực
        const { idToken, email, fullName, avatar } = response.data;
        console.log('Gửi idToken:', idToken);
  
        const googleResponse = await fetch(`${domain}login/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            googleId: idToken,
            email,
            fullName,
            avatar,
          }),
        });
  
        const data = await googleResponse.json();
        console.log('Phản hồi từ backend sau khi đăng nhập Google:', data);
  
        if (!googleResponse.ok) {
          setAlert({ type: 'error', message: data.error || 'Đăng nhập Google thất bại' });
        } else {
          dispatch(loginAction(data));
          router.push('/(tabs)');
        }
      }
    } catch (error) {
      handleError(error);
    }
  };
  
  // Xử lý lỗi khi đăng nhập với Google
  const handleError = (error) => {
    console.log("Lỗi Google login:", error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          setAlert({ type: 'error', message: 'Đăng nhập bị hủy' });
          break;
        case statusCodes.IN_PROGRESS:
          setAlert({ type: 'error', message: 'Đang trong quá trình đăng nhập' });
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          setAlert({ type: 'error', message: 'Google Play Services không khả dụng' });
          break;
        default:
          setAlert({ type: 'error', message: `Lỗi: ${error.message}` });
      }
    } else {
      setAlert({ type: 'error', message: `Lỗi kết nối: ${error.message}` });
    }
  };
  
  // Xử lý đăng nhập với tài khoản thường
  const submitForm = async (values) => {
    setAlert({ type: '', message: '' });
  
    if (!values.emailOrUsername.trim()) {
      console.log("Lỗi: Email hoặc Tên đăng nhập bị trống.");
      return setAlert({ type: 'error', message: 'Email hoặc Tên đăng nhập là bắt buộc' });
    }
    if (!values.password.trim()) {
      console.log("Lỗi: Mật khẩu bị trống.");
      return setAlert({ type: 'error', message: 'Mật khẩu là bắt buộc' });
    }
  
    try {
      console.log('Đang gửi yêu cầu đăng nhập với username/email:', values.emailOrUsername);
      const response = await fetch(`${domain}login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: values.emailOrUsername,
          password: values.password,
          remember: rememberMe, // Gửi giá trị remember me
        }),
      });
  
      const data = await response.json();
      console.log('Phản hồi từ backend sau khi đăng nhập:', data);
  
      if (!response.ok) {
        setAlert({ type: 'error', message: data.error || 'Đăng nhập thất bại' });
      } else {
        dispatch(loginAction(data));
        router.push('/(tabs)');
      }
    } catch (error) {
      console.log('Lỗi kết nối khi đăng nhập:', error);
      setAlert({ type: 'error', message: `Lỗi kết nối: ${error.message}` });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/images/intro.gif')} style={styles.logo} />
        <Text style={styles.title}>ĐĂNG NHẬP</Text>
      </View>
      

      {alert.message && (
        <Text style={[styles.alertText, alert.type === 'error' ? styles.errorAlert : styles.successAlert]}>
          {alert.message}
        </Text>
      )}

      <Formik
        initialValues={{ emailOrUsername: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values) => submitForm(values)}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <Text style={styles.label}>Tên tài khoản / Email</Text>
            <TextInput
              style={[styles.input, errors.emailOrUsername && touched.emailOrUsername && styles.inputError]}
              placeholder="Nhập email hoặc username"
              onChangeText={handleChange('emailOrUsername')}
              onBlur={handleBlur('emailOrUsername')}
              value={values.emailOrUsername}
              keyboardType="email-address"
            />
            {errors.emailOrUsername && touched.emailOrUsername && <Text style={styles.errorText}>{errors.emailOrUsername}</Text>}

            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={[styles.input, errors.password && touched.password && styles.inputError]}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {errors.password && touched.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <View style={styles.checkboxContainer}>
              <CheckBox
                value={rememberMe}
                onValueChange={setRememberMe} // Cập nhật trạng thái remember me
              />
              <Text style={styles.checkboxLabel}>Nhớ tài khoản</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>Hoặc</Text>

            <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
              <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 300,
    marginTop: 60,
  },
  title: {
    fontSize: 30,
    color: '#007bff',
    fontWeight: 'bold',
    marginTop: 30,
  },
  form: {
    marginTop: 20,
  },
  label: {
    marginTop:10,
    fontSize: 16,
    color: '#007bff',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 20,
    height: 50,
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007bff',
  },  
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
  orText: {
    fontSize: 18,
    color: '#007bff',
    marginVertical: 10,
    textAlign: 'center',
  },
  googleButton: {
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  alertText: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  successAlert: {
    color: 'green',
  },
  errorAlert: {
    color: 'red',
  },
});
