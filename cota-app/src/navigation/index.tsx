import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomTabBar } from '../components/TabBar';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { ContributeScreen } from '../screens/ContributeScreen';
import { CreateCategoryScreen } from '../screens/CreateCategoryScreen';
import { CreateDetailsScreen } from '../screens/CreateDetailsScreen';
import { ShareScreen } from '../screens/ShareScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PotsScreen } from '../screens/PotsScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { ValuePropsScreen } from '../screens/onboarding/ValuePropsScreen';
import { AuthMethodsScreen } from '../screens/onboarding/AuthMethodsScreen';
import { EmailFormScreen } from '../screens/onboarding/EmailFormScreen';
import { OTPScreen } from '../screens/onboarding/OTPScreen';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';
import { WelcomeHomeScreen } from '../screens/onboarding/WelcomeHomeScreen';
import { PaymentProcessingScreen } from '../screens/states/PaymentProcessingScreen';
import { SuccessContributionScreen } from '../screens/states/SuccessContributionScreen';
import { SuccessCreatedScreen } from '../screens/states/SuccessCreatedScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { isNew?: boolean } | undefined;
  Contribute: undefined;
  CreateCategory: undefined;
  CreateDetails: { category: string };
  Share: undefined;
  PaymentProcessing: { amount: number };
  SuccessContribution: { amount: number };
  SuccessCreated: undefined;
};

export type RootTabParamList = {
  Home: undefined;
  Pots: undefined;
  Payment: undefined;
  Notifications: undefined;
  Profile: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  ValueProps: undefined;
  AuthMethods: undefined;
  EmailForm: undefined;
  OTP: { email: string };
  ProfileSetup: undefined;
  WelcomeHome: { firstName: string };
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const RootStack = createStackNavigator<RootStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Detail" component={DetailScreen} />
      <HomeStack.Screen name="Contribute" component={ContributeScreen} />
      <HomeStack.Screen name="CreateCategory" component={CreateCategoryScreen} />
      <HomeStack.Screen name="CreateDetails" component={CreateDetailsScreen} />
      <HomeStack.Screen name="Share" component={ShareScreen} />
      <HomeStack.Screen
        name="PaymentProcessing"
        component={PaymentProcessingScreen}
        options={{ gestureEnabled: false }}
      />
      <HomeStack.Screen
        name="SuccessContribution"
        component={SuccessContributionScreen}
        options={{ gestureEnabled: false }}
      />
      <HomeStack.Screen
        name="SuccessCreated"
        component={SuccessCreatedScreen}
        options={{ gestureEnabled: false }}
      />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Pots" component={PotsScreen} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Welcome" component={WelcomeScreen} />
      <OnboardingStack.Screen name="ValueProps" component={ValuePropsScreen} />
      <OnboardingStack.Screen name="AuthMethods" component={AuthMethodsScreen} />
      <OnboardingStack.Screen name="EmailForm" component={EmailFormScreen} />
      <OnboardingStack.Screen name="OTP" component={OTPScreen} />
      <OnboardingStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <OnboardingStack.Screen name="WelcomeHome" component={WelcomeHomeScreen} />
    </OnboardingStack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
      <RootStack.Screen name="Main" component={MainTabs} />
    </RootStack.Navigator>
  );
}
