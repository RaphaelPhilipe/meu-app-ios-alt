import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { VisitDetail } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function VisitDetailScreen(): React.JSX.Element {
  const route = useRoute<RouteProp<Record<string, { id: number }>, string>>();
  const { token, theme } = useAuth();
  const [visit, setVisit] = useState<VisitDetail | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) {
      return;
    }

    setRefreshing(true);
    try {
      const payload = await api.visitDetail(token, route.params.id);
      setVisit(payload.item);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token, route.params.id]);

  return (
    <Screen
      title={visit?.cliente_nome ?? 'Visita'}
      subtitle="Detalhes reais vindos da API mobile, sem depender de WebView para o fluxo principal."
      refreshing={refreshing}
      onRefresh={() => void load()}
    >
      <Card>
        <Label>Status</Label>
        <Value>{visit?.status ?? '-'}</Value>
        <Label>Data</Label>
        <Value>
          {visit?.data_visita ?? '-'} as {visit?.hora_visita ?? '-'}
        </Value>
        <Label>Objetivo</Label>
        <Text style={[styles.body, { color: theme.colors.text }]}>{visit?.objetivo ?? '-'}</Text>
      </Card>

      <Card>
        <Label>Cliente</Label>
        <Value>{visit?.cliente_nome ?? '-'}</Value>
        <Label>CNPJ/CPF</Label>
        <Value>{visit?.cnpj_cpf ?? '-'}</Value>
        <Label>Endereco</Label>
        <Text style={[styles.body, { color: theme.colors.text }]}>{visit?.endereco ?? '-'}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    lineHeight: 22,
    fontSize: 15,
  },
});
