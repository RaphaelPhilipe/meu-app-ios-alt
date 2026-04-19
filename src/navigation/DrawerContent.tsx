import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useAuth } from '../contexts/AuthContext';

export function AppDrawerContent(props: DrawerContentComponentProps): React.JSX.Element {
  const { bootstrap, signOut, theme } = useAuth();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.systemName}>{bootstrap?.branding.system_name ?? 'SIGEV'}</Text>
        <Text style={styles.companyName}>{bootstrap?.branding.company_name ?? 'Operacao mobile'}</Text>
        <Text style={styles.userName}>{bootstrap?.user.nome ?? ''}</Text>
      </View>

      <View style={styles.sections}>
        {(bootstrap?.navigation.sections ?? []).map((section) => (
          <View key={section.id} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textMuted }]}>{section.title}</Text>
            {section.items.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => props.navigation.navigate(item.screen as never)}
                style={({ pressed }) => [
                  styles.item,
                  {
                    backgroundColor: pressed ? theme.colors.surfaceMuted : 'transparent',
                  },
                ]}
              >
                <Text style={[styles.itemLabel, { color: theme.colors.text }]}>{item.label}</Text>
                {!item.implemented ? (
                  <Text style={[styles.badge, { color: theme.colors.secondary }]}>em migracao</Text>
                ) : null}
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <Pressable
        onPress={() => void signOut()}
        style={[styles.logoutButton, { borderColor: theme.colors.border }]}
      >
        <Text style={[styles.logoutText, { color: theme.colors.text }]}>Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  systemName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
  },
  companyName: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  userName: {
    color: '#ffffff',
    marginTop: 18,
    fontSize: 16,
    fontWeight: '700',
  },
  sections: {
    padding: 16,
    gap: 18,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  logoutButton: {
    margin: 16,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
