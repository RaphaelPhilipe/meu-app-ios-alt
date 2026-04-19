import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { IssuesPayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function IssuesScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const [data, setData] = useState<IssuesPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) return;
    setRefreshing(true);
    try {
      setData(await api.issues(token));
    } finally {
      setRefreshing(false);
    }
  }

  async function openDetail(id: number): Promise<void> {
    if (!token) return;
    const payload = await api.issueDetail(token, id);
    const issue = payload.item.issue;
    Alert.alert(issue.protocolo || `Ocorrencia ${issue.id}`, `${issue.tipo}\n${issue.status}\n\n${issue.descricao}`);
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Ocorrencias" subtitle="Acompanhamento operacional das ocorrencias abertas no sistema." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Total</Label>
        <Value>{data?.summary.total ?? 0} registros</Value>
      </Card>

      {(data?.items ?? []).map((item) => (
        <Pressable key={item.id} onPress={() => void openDetail(item.id)}>
          <Card>
            <Text style={[styles.title, { color: theme.colors.text }]}>{item.protocolo || `Ocorrencia #${item.id}`}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{item.cliente_nome}</Text>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{item.tipo}</Text>
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
