import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { DashboardPayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';
import { hexToRgba } from '../utils/colors';

export function DashboardScreen(): React.JSX.Element {
  const { token, bootstrap, theme } = useAuth();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) {
      return;
    }

    setRefreshing(true);
    try {
      setData(await api.dashboard(token));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen
      title={`Bem-vindo, ${bootstrap?.user.nome?.split(' ')[0] ?? 'usuario'}`}
      subtitle="Visao inicial do SIGEV nativo, alimentada pela API mobile."
      refreshing={refreshing}
      onRefresh={() => void load()}
    >
      <View style={styles.metricsGrid}>
        {(data?.metrics ?? []).map((metric) => (
          <View
            key={metric.label}
            style={[
              styles.metricTile,
              {
                backgroundColor: hexToRgba(theme.colors.primary, 0.08),
                borderColor: hexToRgba(theme.colors.primary, 0.18),
              },
            ]}
          >
            <Text style={[styles.metricLabel, { color: theme.colors.textMuted }]}>{metric.label}</Text>
            <Text style={[styles.metricValue, { color: theme.colors.text }]}>{metric.value}</Text>
          </View>
        ))}
      </View>

      <Card>
        <Label>Proximas visitas</Label>
        {(data?.upcoming_visits ?? []).slice(0, 5).map((visit) => (
          <View key={visit.id} style={styles.row}>
            <Value>{visit.cliente_nome}</Value>
            <Text style={[styles.rowMeta, { color: theme.colors.textMuted }]}>
              {visit.data_visita} as {visit.hora_visita} • {visit.status}
            </Text>
          </View>
        ))}
      </Card>

      <Card>
        <Label>Notificacoes recentes</Label>
        {(data?.notifications ?? []).map((notification) => (
          <View key={notification.id} style={styles.row}>
            <Value>{notification.mensagem}</Value>
            <Text style={[styles.rowMeta, { color: theme.colors.textMuted }]}>{notification.data_criacao}</Text>
          </View>
        ))}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricTile: {
    width: '47%',
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 30,
    fontWeight: '800',
  },
  row: {
    gap: 4,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#d9e5d4',
  },
  rowMeta: {
    lineHeight: 20,
  },
});
