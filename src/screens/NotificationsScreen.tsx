import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { NotificationsPayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function NotificationsScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const [data, setData] = useState<NotificationsPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) return;
    setRefreshing(true);
    try {
      setData(await api.notifications(token));
    } finally {
      setRefreshing(false);
    }
  }

  async function markOne(id: number): Promise<void> {
    if (!token) return;
    await api.notificationRead(token, id);
    await load();
  }

  async function markAll(): Promise<void> {
    if (!token) return;
    try {
      await api.notificationReadAll(token);
      await load();
    } catch (error) {
      Alert.alert('Falha', error instanceof Error ? error.message : 'Nao foi possivel atualizar as notificacoes.');
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Notificacoes" subtitle="Avisos do sistema web ja acessiveis pelo app nativo." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Resumo</Label>
        <Value>{data?.summary.unread ?? 0} nao lidas</Value>
        <Pressable onPress={() => void markAll()} style={[styles.action, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.actionLabel}>Marcar todas como lidas</Text>
        </Pressable>
      </Card>

      {(data?.items ?? []).map((item) => (
        <Card key={item.id}>
          <Text style={[styles.message, { color: theme.colors.text }]}>{item.mensagem}</Text>
          <View style={styles.row}>
            <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{item.data_criacao}</Text>
            {(item.lida ?? 0) === 0 ? (
              <Pressable onPress={() => void markOne(item.id)}>
                <Text style={[styles.link, { color: theme.colors.secondary }]}>Marcar como lida</Text>
              </Pressable>
            ) : (
              <Text style={[styles.meta, { color: theme.colors.primary }]}>Lida</Text>
            )}
          </View>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  action: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  actionLabel: {
    color: '#ffffff',
    fontWeight: '800',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 13,
  },
  link: {
    fontWeight: '700',
  },
});
