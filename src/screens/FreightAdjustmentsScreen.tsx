import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { FreightAdjustmentsPayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function FreightAdjustmentsScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const [data, setData] = useState<FreightAdjustmentsPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) return;
    setRefreshing(true);
    try {
      setData(await api.freightAdjustments(token));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Reajuste de Frete" subtitle="Lista das solicitacoes de reajuste e seus status atuais." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Total</Label>
        <Value>{data?.summary.total ?? 0} solicitacoes</Value>
      </Card>

      {(data?.items ?? []).map((item) => (
        <Pressable
          key={item.id}
          onPress={() =>
            Alert.alert(item.cliente_nome, `${item.status}\n${item.tipo_solicitacao}\n\n${item.motivo || 'Sem motivo informado.'}`)
          }
        >
          <Card>
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.cliente_nome}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{item.tipo_solicitacao}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{item.data_solicitacao}</Text>
            <Text style={[styles.meta, { color: theme.colors.primary }]}>{item.status}</Text>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '800',
  },
  meta: {
    fontSize: 14,
  },
});
