import React, { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { SettingsPayload } from '../types/mobile';
import { Card, Label, Screen } from '../components/Screen';

export function SettingsScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const [data, setData] = useState<SettingsPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) {
      return;
    }

    setRefreshing(true);
    try {
      setData(await api.settings(token));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Configuracoes" subtitle="Preferencias de runtime e limites de integracao." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Preferencias atuais</Label>
        {(data?.toggles ?? []).map((toggle) => (
          <View key={toggle.key} style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.text }]}>{toggle.label}</Text>
            <Switch value={toggle.enabled} />
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
});
