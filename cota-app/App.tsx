import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator, RootStackParamList } from './src/navigation';
import { AuthProvider } from './src/lib/auth';

// A shared pot link (cota://pot/:id) opens the account-less guest flow.
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['cota://', 'https://cota.app'],
  config: {
    screens: {
      Guest: {
        screens: {
          GuestLanding: 'pot/:potId',
        },
      },
    },
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer linking={linking}>
            <StatusBar style="dark" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
