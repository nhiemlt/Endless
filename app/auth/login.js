import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Image } from 'react-native';
import CheckBox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { loginAction } from '../(redux)/authSlice';
import { GoogleSignin, statusCodes, isErrorWithCode, isSuccessResponse } from '@react-native-google-signin/google-signin';
import axios from 'axios'; // Import axios
import { domain } from '../../constants/Domain'; // Import domain
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [rememberMe, setRememberMe] = useState(false); // Quản lý trạng thái remember me
  const [emailOrUsername, setEmailOrUsername] = useState(''); // Tên tài khoản hoặc email
  const [password, setPassword] = useState(''); // Mật khẩu
  const [errors, setErrors] = useState({ emailOrUsername: '', password: '' });

  useEffect(() => {
    const clearAuthData = async () => {
      // Xóa authToken và thông tin người dùng trong AsyncStorage
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userInfo');

      // Reset Redux state (token và userInfo)
      dispatch(loginAction({ token: '', user: null }));

      // Reset trạng thái các form và rememberMe
      setEmailOrUsername('');
      setPassword('');
      setRememberMe(false);
      setAlert({ type: '', message: '' });
      setErrors({ emailOrUsername: '', password: '' });
    };

    clearAuthData();
  }, []);

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
  
        const googleResponse = await axios.post(`${domain}login/google`, {
          googleId: idToken,
          email,
          fullName,
          avatar,
        });
  
        const data = googleResponse.data;
        console.log('Phản hồi từ backend sau khi đăng nhập Google:', data);
  
        if (googleResponse.status !== 200) {
          setAlert({ type: 'error', message: data.error || 'Đăng nhập Google thất bại' });
        } else {
          // Lưu token và thông tin người dùng vào AsyncStorage và Redux
          await AsyncStorage.setItem('authToken', data.token); // Lưu token vào AsyncStorage
          dispatch(loginAction({ token: data.token, userInfo: data.role })); // Lưu thông tin người dùng vào Redux
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
  const submitForm = async () => {
    setAlert({ type: '', message: '' });
    let formValid = true;
    let newErrors = { emailOrUsername: '', password: '' };

    // Validation for email/username
    if (!emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email hoặc Tên đăng nhập là bắt buộc';
      formValid = false;
    } else if (emailOrUsername.includes('@') && !/\S+@\S+\.\S+/.test(emailOrUsername)) {
      newErrors.emailOrUsername = 'Email không hợp lệ';
      formValid = false;
    }

    // Validation for password
    if (!password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      formValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu quá ngắn';
      formValid = false;
    }

    setErrors(newErrors);

    if (!formValid) {
      return; // Nếu có lỗi, không tiếp tục gửi yêu cầu
    }

    try {
      console.log('Đang gửi yêu cầu đăng nhập với username/email:', emailOrUsername);
      const response = await axios.post(`${domain}/login`, {
        username: emailOrUsername,
        password: password,
        remember: rememberMe, // Gửi giá trị remember me
      });

      const data = response.data;
      console.log('Phản hồi từ backend sau khi đăng nhập:', data);

      if (response.status !== 200) {
        setAlert({ type: 'error', message: data.error || 'Đăng nhập thất bại' });
      } else {
        // Lưu token và thông tin người dùng vào AsyncStorage và Redux
        await AsyncStorage.setItem('authToken', data.token); // Lưu token vào AsyncStorage
        dispatch(loginAction({ token: data.token, userInfo: data.userInfo })); // Lưu thông tin người dùng vào Redux
        router.push('/(tabs)');

        // Reset form sau khi đăng nhập thành công
        setEmailOrUsername('');
        setPassword('');
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

      <View style={styles.form}>
        <Text style={styles.label}>Tên tài khoản / Email</Text>
        <TextInput
          style={[styles.input, errors.emailOrUsername && styles.inputError]}
          placeholder="Nhập email hoặc username"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
        />
        {errors.emailOrUsername && <Text style={styles.errorText}>{errors.emailOrUsername}</Text>}

        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={[styles.input, errors.password && styles.inputError]}
          placeholder="Nhập mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <View style={styles.checkboxContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe} // Cập nhật trạng thái remember me
          />
          <Text style={styles.checkboxLabel}>Nhớ tài khoản</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={submitForm}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Hoặc</Text>

        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
        </TouchableOpacity>
      </View>
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
