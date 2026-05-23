import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { CustomTabBar } from '../components/TabBar';
import { CotaMark } from '../icons/Icons';
import { useAuth } from '../lib/auth';
import { T } from '../theme';
import { HomeScreen } from '../screens/HomeScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { ContributeScreen } from '../screens/ContributeScreen';
import { CreateCategoryScreen } from '../screens/CreateCategoryScreen';
import { CreateDetailsScreen } from '../screens/CreateDetailsScreen';
import { ShareScreen } from '../screens/ShareScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PotsScreen } from '../screens/PotsScreen';
import { PaymentScreen } from '../screens/PaymentScreen';
import { PaymentMethodsScreen } from '../screens/PaymentMethodsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { WelcomeScreen } from '../screens/onboarding/WelcomeScreen';
import { ValuePropsScreen } from '../screens/onboarding/ValuePropsScreen';
import { AuthMethodsScreen } from '../screens/onboarding/AuthMethodsScreen';
import { EmailFormScreen } from '../screens/onboarding/EmailFormScreen';
import { PhoneFormScreen } from '../screens/onboarding/PhoneFormScreen';
import { OTPScreen } from '../screens/onboarding/OTPScreen';
import { ProfileSetupScreen } from '../screens/onboarding/ProfileSetupScreen';
import { WelcomeHomeScreen } from '../screens/onboarding/WelcomeHomeScreen';
import { PaymentProcessingScreen } from '../screens/states/PaymentProcessingScreen';
import { SuccessContributionScreen } from '../screens/states/SuccessContributionScreen';
import { SuccessCreatedScreen } from '../screens/states/SuccessCreatedScreen';
import { PublicLandingScreen } from '../screens/public/PublicLandingScreen';
import { PublicContributeScreen } from '../screens/public/PublicContributeScreen';
import { PublicPaymentScreen } from '../screens/public/PublicPaymentScreen';
import { PublicThanksScreen } from '../screens/public/PublicThanksScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  Detail: { potId: string };
  Contribute: { potId: string };
  CreateCategory: undefined;
  CreateDetails: { category: string };
  Share: undefined;
  PaymentProcessing: { potId: string; amount: number; cardId: string };
  SuccessContribution: { potId: string; amount: number; contributionId: string; cardId: string };
  SuccessCreated: { potId: string };
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
  AuthMethods: { mode: 'login' | 'signup' };
  EmailForm: { mode: 'login' | 'signup' };
  PhoneForm: { mode: 'login' | 'signup' };
  OTP: { email?: string; phone?: string };
  ProfileSetup: undefined;
  WelcomeHome: { firstName: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  PaymentMethods: undefined;
};

export type GuestStackParamList = {
  GuestLanding: { potId?: string } | undefined;
  GuestContribute: undefined;
  GuestPayment: { amount: number };
  GuestThanks: { amount: number };
};

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Guest: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const GuestStack = createStackNavigator<GuestStackParamList>();
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

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
    </ProfileStack.Navigator>
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
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
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
      <OnboardingStack.Screen name="PhoneForm" component={PhoneFormScreen} />
      <OnboardingStack.Screen name="OTP" component={OTPScreen} />
      <OnboardingStack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <OnboardingStack.Screen name="WelcomeHome" component={WelcomeHomeScreen} />
    </OnboardingStack.Navigator>
  );
}

function GuestNavigator() {
  return (
    <GuestStack.Navigator screenOptions={{ headerShown: false }}>
      <GuestStack.Screen name="GuestLanding" component={PublicLandingScreen} />
      <GuestStack.Screen name="GuestContribute" component={PublicContributeScreen} />
      <GuestStack.Screen name="GuestPayment" component={PublicPaymentScreen} />
      <GuestStack.Screen
        name="GuestThanks"
        component={PublicThanksScreen}
        options={{ gestureEnabled: false }}
      />
    </GuestStack.Navigator>
  );
}

function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <CotaMark size={72} color={T.brand} />
      <ActivityIndicator color={T.brand} />
    </View>
  );
}

export function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <RootStack.Screen name="Main" component={MainTabs} />
      ) : (
        <RootStack.Screen name="Onboarding" component={OnboardingNavigator} />
      )}
      <RootStack.Screen name="Guest" component={GuestNavigator} />
    </RootStack.Navigator>
  );
}
