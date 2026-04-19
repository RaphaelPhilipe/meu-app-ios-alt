import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { VisitSummary } from '../types/mobile';
import { Card, Screen } from '../components/Screen';

export function VisitsScreen(): React.JSX.Element {
  const navigation = useNavigation<any>();
  const { token, theme } = useAuth();
  const [visits, setVisits] = useState<VisitSummary[]>([]);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) {
      return;
    }

    setRefreshing(true);
    try {
      const payload = await api.visits(token);
      setVisits(payload.items);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  const filtered = visits.filter((visit) => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return true;
    }

    return `${visit.cliente_nome} ${visit.objetivo} ${visit.status}`.toLowerCase().includes(search);
  });

  return (
    <Screen
      title="Visitas"
      subtitle="Lista operacional pronta para evoluir depois com check-in, aprovacao e sincronizacao offline."
      refreshing={refreshing}
      onRefresh={() => void load()}
    >
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Buscar por cliente, objetivo ou status"
        style={[
          styles.search,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
      />

      {filtered.map((visit) => (
        <Pressable key={visit.id} onPress={() => navigation.navigate('VisitDetail', { id: visit.id })}>
          <Card>
            <Text style={[styles.client, { color: theme.colors.text }]}>{visit.cliente_nome}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
              {visit.data_visita} as {visit.hora_visita}
            </Text>
            <View style={styles.footer}>
              <Text style={[styles.objective, { color: theme.colors.textMuted }]}>{visit.objetivo}</Text>
              <Text style={[styles.status, { color: theme.colors.primary }]}>{visit.status}</Text>
            </View>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
  },
  client: {
    fontSize: 18,
    fontWeight: '800',
  },
  meta: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  objective: {
    flex: 1,
    lineHeight: 20,
  },
  status: {
    fontWeight: '800',
  },
});
