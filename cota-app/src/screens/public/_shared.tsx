import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { T } from '../../theme';
import { Avatar } from '../../components/Avatar';
import { ShieldIcon } from '../../icons/Icons';

type Tone = 'neutral' | 'blue' | 'pink' | 'amber' | 'green' | 'violet';

// Slim banner replacing the in-app top nav: this user has no account.
export const PublicTopBar = ({ onBrand = false }: { onBrand?: boolean }) => {
  const ink = onBrand ? '#fff' : T.ink;
  const muted = onBrand ? 'rgba(255,255,255,0.78)' : T.ink3;
  const btnBg = onBrand ? 'rgba(255,255,255,0.14)' : T.surface;
  const sep = onBrand ? 'rgba(255,255,255,0.22)' : T.sep;

  return (
    <View style={styles.topBar}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={[styles.mark, { backgroundColor: onBrand ? 'rgba(255,255,255,0.95)' : T.brand }]}>
          <Text style={[styles.markText, { color: onBrand ? T.brand : '#fff' }]}>c.</Text>
        </View>
        <View>
          <Text style={[styles.brandName, { color: ink }]}>Cota</Text>
          <Text style={[styles.brandSub, { color: muted }]}>Cagnotte sécurisée</Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.openBtn, { backgroundColor: btnBg, borderColor: sep, borderWidth: onBrand ? 0 : 1 }]}
      >
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
          <Path
            d="M14 3h7v7M21 3l-9 9M10 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"
            stroke={ink}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Text style={[styles.openBtnText, { color: ink }]}>Ouvrir dans l'app</Text>
      </TouchableOpacity>
    </View>
  );
};

export const PoweredBy = () => (
  <View style={styles.poweredBy}>
    <ShieldIcon size={12} color={T.ink3} />
    <Text style={styles.poweredByText}>
      Paiement sécurisé via <Text style={{ color: T.ink2, fontWeight: '700' }}>Cota</Text> · Stripe
    </Text>
  </View>
);

interface AvatarStackProps {
  items: { i: string; t: Tone }[];
  extra?: number;
  size?: number;
}

export const AvatarStack = ({ items, extra = 0, size = 32 }: AvatarStackProps) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    {items.map((it, i) => (
      <View
        key={i}
        style={{
          marginLeft: i === 0 ? 0 : -10,
          borderRadius: size,
          borderWidth: 2.5,
          borderColor: '#fff',
        }}
      >
        <Avatar initials={it.i} tone={it.t} size={size} />
      </View>
    ))}
    {extra > 0 && (
      <View
        style={{
          marginLeft: -10,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: T.field,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2.5,
          borderColor: '#fff',
        }}
      >
        <Text style={{ fontSize: size * 0.34, fontWeight: '600', color: T.ink2 }}>+{extra}</Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  mark: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: { fontWeight: '700', fontSize: 14, letterSpacing: -1 },
  brandName: { fontSize: 13, fontWeight: '600' },
  brandSub: { fontSize: 10, marginTop: 1 },
  openBtn: {
    borderRadius: 99,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  openBtnText: { fontSize: 12, fontWeight: '600' },
  poweredBy: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  poweredByText: { fontSize: 11, color: T.ink3, fontWeight: '500' },
});
