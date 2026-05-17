import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { T } from '../theme';
import {
  HomeActiveIcon, HomeInactiveIcon,
  PotsActiveIcon, PotsInactiveIcon,
  PayActiveIcon, PayInactiveIcon,
  BellTabActiveIcon, BellTabInactiveIcon,
  UserActiveIcon, UserInactiveIcon,
} from '../icons/Icons';

const TAB_LABELS = ['Accueil', 'Cagnottes', 'Paiement', 'Notifs', 'Profil'];

type TabIconFC = React.FC<{ size?: number }>;
const TAB_ICONS: Record<string, { active: TabIconFC; inactive: TabIconFC }> = {
  Home:          { active: HomeActiveIcon,    inactive: HomeInactiveIcon },
  Pots:          { active: PotsActiveIcon,    inactive: PotsInactiveIcon },
  Payment:       { active: PayActiveIcon,     inactive: PayInactiveIcon },
  Notifications: { active: BellTabActiveIcon, inactive: BellTabInactiveIcon },
  Profile:       { active: UserActiveIcon,    inactive: UserInactiveIcon },
};

export const CustomTabBar = ({ state, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 4 }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const label = TAB_LABELS[index] ?? route.name;
        const icons = TAB_ICONS[route.name];
        const Icon = isFocused ? icons?.active : icons?.inactive;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              if (!isFocused) navigation.navigate(route.name);
            }}
            activeOpacity={0.7}
            style={styles.tab}
          >
            {Icon ? <Icon size={24} /> : null}
            <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60,60,67,0.2)',
    paddingTop: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  label: {
    fontSize: 10,
    color: T.ink3,
    fontWeight: '500',
  },
  labelActive: {
    color: T.brand,
  },
});
