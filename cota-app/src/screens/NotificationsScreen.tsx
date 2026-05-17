import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { T } from '../theme';
import { Avatar } from '../components/Avatar';
import { homeNotifications } from '../data/mock';
import { EmptyNotifications } from './states/EmptyNotifications';

const NOTIFS = homeNotifications;

export const NotificationsScreen = () => {
  const insets = useSafeAreaInsets();
  const unreadCount = NOTIFS.flatMap(g => g.items).filter(n => n.unread).length;

  if (NOTIFS.length === 0) return <EmptyNotifications />;

  return (
    <View style={{ flex: 1, backgroundColor: T.bg }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSub}>{unreadCount} non lues</Text>
          )}
        </View>
        <TouchableOpacity>
          <Text style={styles.markAll}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {NOTIFS.map((group) => (
          <View key={group.section}>
            <Text style={styles.sectionLabel}>{group.section}</Text>
            <View style={styles.group}>
              {group.items.map((notif, i) => (
                <View key={i}>
                  <TouchableOpacity activeOpacity={0.75} style={[styles.row, notif.unread && styles.rowUnread]}>
                    <View style={{ position: 'relative' }}>
                      <Avatar initials={notif.initials} tone={notif.tone} size={44} />
                      {notif.unread && <View style={styles.unreadDot} />}
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.notifBody} numberOfLines={2}>{notif.body}</Text>
                      <Text style={styles.notifTime}>{notif.time}</Text>
                    </View>
                  </TouchableOpacity>
                  {i < group.items.length - 1 && <View style={styles.sep} />}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingBottom: 16,
  },
  headerTitle: { fontSize: 28, fontWeight: '700', color: T.ink, letterSpacing: -0.5 },
  headerSub: { fontSize: 13, color: T.brand, fontWeight: '500', marginTop: 2 },
  markAll: { fontSize: 14, color: T.brand, fontWeight: '600', marginTop: 8 },
  sectionLabel: {
    fontSize: 12, color: T.ink3, fontWeight: '600',
    textTransform: 'uppercase', letterSpacing: 0.8,
    paddingHorizontal: 20, marginBottom: 8, marginTop: 4,
  },
  group: {
    marginHorizontal: 20, backgroundColor: T.surface,
    borderRadius: 18, overflow: 'hidden',
    borderWidth: 1, borderColor: T.sep, marginBottom: 8,
  },
  row: { flexDirection: 'row', alignItems: 'flex-start', padding: 14 },
  rowUnread: { backgroundColor: T.brandSoft },
  unreadDot: {
    position: 'absolute', top: 0, right: 0,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: T.brand, borderWidth: 2, borderColor: T.surface,
  },
  notifTitle: { fontSize: 14, fontWeight: '700', color: T.ink, marginBottom: 2 },
  notifBody: { fontSize: 13, color: T.ink2, lineHeight: 18 },
  notifTime: { fontSize: 11, color: T.ink3, marginTop: 4 },
  sep: { height: 0.5, backgroundColor: T.sep, marginLeft: 70 },
});
