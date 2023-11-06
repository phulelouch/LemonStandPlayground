import BottomHalf from '../common/modal/bottom-half';
import {View, Text, TouchableOpacity, Linking} from 'react-native';

// TODO: Add text to translations
const NotificationModal = ({isModalVisible, setModalVisible}) => {
  return (
    <BottomHalf
      isVisible={isModalVisible}
      onSwipeComplete={() => setModalVisible(false)}
      swipeDirection={['down']}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
      }}>
      <View>
        <Text
          style={{
            fontFamily: 'Poppins-Medium',
            fontSize: 16,
            marginBottom: 10,
          }}>
          Open notification settings
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins',
            color: '#666',
            marginBottom: 20,
          }}>
          You need to enable notifications to receive notifications from us and
          to use the app. Please go to your settings and enable notifications.
        </Text>

        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginBottom: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              Linking.openSettings();
            }}
            style={{
              backgroundColor: '#222',
              padding: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: '#fff',
                fontFamily: 'Poppins',
                fontSize: 14,
              }}>
              Open settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            style={{
              backgroundColor: '#f1f1f1',
              padding: 10,
              borderRadius: 5,
            }}>
            <Text
              style={{
                fontFamily: 'Poppins',
                fontSize: 14,
              }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomHalf>
  );
};

export default NotificationModal;
