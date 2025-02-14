import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer,  DrawerActions  } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './HomeScreen';
import AboutUs from './AboutUs';

// Define types for navigation params
type RootStackParamList = {
  HomeStack: {
    openQRModal?: boolean;
    openQRScanner?: boolean;
  };
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: 'blue' },
        headerTitleStyle: { color: 'white' },
        headerTintColor: 'white',
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            style={{ marginHorizontal: 15 }}
          >
            <FontAwesome name="bars" size={24} color="white" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            {/* QR Code Icon */}
            <TouchableOpacity
              onPress={() => navigation.navigate('HomeStack', { openQRModal: true })}
              style={{ marginHorizontal: 10 }}
            >
              <FontAwesome name="qrcode" size={24} color="white" />
            </TouchableOpacity>
            {/* QR Scanner Icon */}
            <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { openQRScanner: true })}
              style={{ marginHorizontal: 10 }}
              >
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="white" />
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      <Stack.Screen name="HomeStack" component={HomeScreen} options={{ title: 'Home' }} initialParams={{ openQRModal: false, openQRScanner: false }} />
    </Stack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: { backgroundColor: '#fff', width: 240 },
          headerShown: false, // Disable default header in Drawer for custom StackNavigator header
        }}
      >
        {/* Include the Stack Navigator */}
        <Drawer.Screen name="Home" component={StackNavigator} options={{ drawerLabel: 'Home' }} />
        {/* Add AboutUs Screen */}
        <Drawer.Screen name="AboutUs" component={AboutUs} options={{ drawerLabel: 'About Us' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;
