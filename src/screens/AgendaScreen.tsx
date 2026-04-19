import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { AgendaPayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function AgendaScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const [data, setData] = useState<AgendaPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) return;
    setRefreshing(true);
    try {
      setData(await api.agenda(token));
    } finally {
      setRefreshing(false);
    }
  }

  async function schedule(date?: string): Promise<void> {
    if (!token || !data) return;
    try {
      const result = await api.scheduleAgenda(token, {
        month: data.filters.month,
        year: data.filters.year,
        criteria: data.filters.criteria,
        date,
      });
      Alert.alert('Agenda processada', `Criados: ${result.result.criados} • Ignorados: ${result.result.ignorados}`);
    } catch (error) {
      Alert.alert('Falha', error instanceof Error ? error.message : 'Nao foi possivel agendar as visitas.');
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Agenda" subtitle="Sugestoes mensais do motor de agenda inteligente do SIGEV." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Periodo</Label>
        <Value>
          {data?.filters.month ?? '-'} / {data?.filters.year ?? '-'}
        </Value>
        <Label>Vendedor</Label>
        <Value>{data?.seller?.nome ?? '-'}</Value>
        <Pressable onPress={() => void schedule()} style={[styles.primary, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.primaryLabel}>Agendar mes inteiro</Text>
        </Pressable>
      </Card>

      {(data?.days ?? []).map((day) => (
        <Card key={day.date}>
          <View style={styles.row}>
            <Value>{day.date}</Value>
            <Pressable onPress={() => void schedule(day.date)}>
              <Text style={[styles.scheduleDay, { color: theme.colors.secondary }]}>Agendar dia</Text>
            </Pressable>
          </View>
          {day.items.slice(0, 4).map((item) => (
            <View key={item.id} style={styles.item}>
              <Text style={[styles.itemTitle, { color: theme.colors.text }]}>{item.nome}</Text>
              <Text style={[styles.itemMeta, { color: theme.colors.textMuted }]}>
                {item.regiao || 'Sem regiao'} • {item.dias_sem_visita ?? '-'} dias sem visita
              </Text>
            </View>
          ))}
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  primary: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryLabel: {
    color: '#ffffff',
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleDay: {
    fontWeight: '700',
  },
  item: {
    gap: 4,
  },
  itemTitle: {
    fontWeight: '700',
  },
  itemMeta: {
    fontSize: 13,
  },
});
