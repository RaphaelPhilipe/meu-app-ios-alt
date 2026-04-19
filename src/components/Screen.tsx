import React from 'react';
import { Image, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { brandAssets } from '../assets/branding';

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({ title, subtitle, children, refreshing = false, onRefresh }: Props): React.JSX.Element {
  const { theme } = useAuth();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
          ) : undefined
        }
      >
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <ImageBackground source={brandAssets.hero} imageStyle={styles.heroImage} style={styles.heroBackground}>
            <View style={styles.overlay}>
              <Image source={brandAssets.logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          </ImageBackground>
        </LinearGradient>
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

export function Card({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { theme } = useAuth();
  return <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>{children}</View>;
}

export function Label({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { theme } = useAuth();
  return <Text style={[styles.label, { color: theme.colors.textMuted }]}>{children}</Text>;
}

export function Value({ children }: { children: React.ReactNode }): React.JSX.Element {
  const { theme } = useAuth();
  return <Text style={[styles.value, { color: theme.colors.text }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingBottom: 32 },
  hero: {
    margin: 16,
    borderRadius: 28,
    overflow: 'hidden',
    minHeight: 190,
  },
  heroBackground: {
    minHeight: 190,
  },
  heroImage: {
    opacity: 0.26,
  },
  overlay: {
    minHeight: 190,
    padding: 24,
    justifyContent: 'flex-end',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    marginTop: 8,
    lineHeight: 22,
  },
  logo: {
    width: 132,
    height: 48,
    marginBottom: 16,
  },
  body: {
    gap: 14,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
});
