import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import UserAddressService from '../(services)/api/userAddressService'
import GHNService from '../(services)/api/GHNService'

const AddressForm = () => {
  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [address, setAddress] = useState({
    detailAddress: '',
    provinceID: '',
    districtID: '',
    wardCode: '',
    provinceName: '',
    districtName: '',
    wardName: ''
  })
  const {
    fetchUserAddresses,
    addUserAddressCurrent,
    deleteUserAddressCurrent
  } = UserAddressService()
  const [userAddresses, setUserAddresses] = useState([])
  const [loading, setLoading] = useState(false)

  // Hàm tải danh sách địa chỉ khi trang load
  useEffect(() => {
    const loadAddresses = async () => {
      setLoading(true)
      try {
        const updatedAddresses = await fetchUserAddresses()
        setUserAddresses(updatedAddresses)
      } catch (error) {
        console.error('Lỗi khi tải danh sách địa chỉ:', error)
        Alert.alert('Lỗi', 'Không thể tải danh sách địa chỉ.')
      } finally {
        setLoading(false)
      }
    }

    loadAddresses()
  }, []) // Chỉ gọi khi trang lần đầu được load

  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading(true)
      try {
        const response = await GHNService.getProvinces()
        setProvinces(response.data)
      } catch (error) {
        console.error('Lỗi khi tải danh sách tỉnh:', error)
        Alert.alert('Lỗi', 'Không thể tải danh sách tỉnh/thành phố.')
      } finally {
        setLoading(false)
      }
    }

    fetchProvinces()
  }, []) // Tải tỉnh/thành phố lần đầu

  const handleProvinceChange = async provinceID => {
    const selectedProvince = provinces.find(
      province => province.ProvinceID === provinceID
    )
    setAddress({
      ...address,
      provinceID,
      provinceName: selectedProvince?.ProvinceName
    })
    setDistricts([])
    setWards([])
    try {
      const response = await GHNService.getDistrictsByProvince(provinceID)
      setDistricts(response.data)
    } catch (error) {
      console.error('Lỗi khi tải danh sách quận/huyện:', error)
      Alert.alert('Lỗi', 'Không thể tải danh sách quận/huyện.')
    }
  }

  const handleDistrictChange = async districtID => {
    const selectedDistrict = districts.find(
      district => district.DistrictID === districtID
    )
    setAddress({
      ...address,
      districtID,
      districtName: selectedDistrict?.DistrictName
    })
    setWards([])
    try {
      const response = await GHNService.getWardsByDistrict(districtID)
      setWards(response.data)
    } catch (error) {
      console.error('Lỗi khi tải danh sách phường/xã:', error)
      Alert.alert('Lỗi', 'Không thể tải danh sách phường/xã.')
    }
  }

  const handleWardChange = wardCode => {
    const selectedWard = wards.find(ward => ward.WardCode === wardCode)
    setAddress({ ...address, wardCode, wardName: selectedWard?.WardName })
  }

  const handleSubmit = async () => {
    if (
      !address.provinceID ||
      !address.districtID ||
      !address.wardCode ||
      !address.detailAddress
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin địa chỉ!')
      return
    }
  
    setLoading(true)
    try {
      const response = await addUserAddressCurrent(address)
      console.log('Địa chỉ đã được thêm:', response)
  
      // Reset form after successful address addition
      setAddress({
        detailAddress: '',
        provinceID: '',
        districtID: '',
        wardCode: '',
        provinceName: '',
        districtName: '',
        wardName: ''
      })
  
      const updatedAddresses = await fetchUserAddresses()
      setUserAddresses(updatedAddresses)
    } catch (error) {
      console.error('Lỗi khi thêm địa chỉ:', error)
      Alert.alert('Lỗi', 'Không thể thêm địa chỉ.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async addressID => {
    setLoading(true)
    try {
      await deleteUserAddressCurrent(addressID)
      const updatedAddresses = await fetchUserAddresses()
      setUserAddresses(updatedAddresses)
    } catch (error) {
      console.error('Lỗi khi xóa địa chỉ:', error)
      Alert.alert('Lỗi', 'Không thể xóa địa chỉ.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cập nhật địa chỉ</Text>

      {loading ? (
        <ActivityIndicator size='large' color='#0000ff' />
      ) : (
        <>
          <Picker
            selectedValue={address.provinceID}
            onValueChange={handleProvinceChange}
            style={styles.picker}
          >
            <Picker.Item label='Chọn tỉnh' value='' />
            {provinces.map(province => (
              <Picker.Item
                key={province.ProvinceID}
                label={province.ProvinceName}
                value={province.ProvinceID}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={address.districtID}
            onValueChange={handleDistrictChange}
            style={styles.picker}
          >
            <Picker.Item label='Chọn quận/huyện' value='' />
            {districts.map(district => (
              <Picker.Item
                key={district.DistrictID}
                label={district.DistrictName}
                value={district.DistrictID}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={address.wardCode}
            onValueChange={handleWardChange}
            style={styles.picker}
          >
            <Picker.Item label='Chọn phường/xã' value='' />
            {wards.map(ward => (
              <Picker.Item
                key={ward.WardCode}
                label={ward.WardName}
                value={ward.WardCode}
              />
            ))}
          </Picker>

          <TextInput
            style={styles.textInput}
            value={address.detailAddress}
            onChangeText={text =>
              setAddress({ ...address, detailAddress: text })
            }
            placeholder='Địa chỉ chi tiết'
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
            <Text style={styles.addButtonText}>Thêm</Text>
          </TouchableOpacity>
          <View style={styles.addressList}>
            <Text style={styles.subtitle}>Danh sách địa chỉ người dùng</Text>
            {userAddresses.length > 0 ? (
              userAddresses.map(userAddress => (
                <View key={userAddress.addressID} style={styles.addressItem}>
                  <Text style={styles.addressText}>
                    {userAddress.detailAddress}, {userAddress.wardName},{' '}
                    {userAddress.districtName}, {userAddress.provinceName}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleDelete(userAddress.addressID)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text>Chưa có địa chỉ nào</Text>
            )}
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    flex: 1
  },
  title: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20
  },
  picker: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff'
  },
  textInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 8,
    paddingLeft: 10,
    backgroundColor: '#fff'
  },
  addressList: {
    marginTop: 20
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10
  },
  addressItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  deleteButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14
  },
  addButton: {
    backgroundColor: '#1e90ff', 
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 8,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 10
  },
  addButtonText: {
    color: 'white',
    fontSize: 18, 
    fontWeight: 'bold' 
  }
})

export default AddressForm
