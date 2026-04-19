import React, { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { HelpPayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function HelpScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const [data, setData] = useState<HelpPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) {
      return;
    }

    setRefreshing(true);
    try {
      setData(await api.help(token));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Ajuda" subtitle="Suporte e respostas rapidas para operacao." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Contato</Label>
        <Value>{data?.contact.email ?? '-'}</Value>
        <Value>{data?.contact.whatsapp ?? '-'}</Value>
        {data?.contact.help_url ? (
          <Pressable onPress={() => void Linking.openURL(data.contact.help_url)}>
            <Text style={[styles.link, { color: theme.colors.primary }]}>{data.contact.help_url}</Text>
          </Pressable>
        ) : null}
      </Card>

      {(data?.faq ?? []).map((item) => (
        <Card key={item.question}>
          <Label>{item.question}</Label>
          <Text style={[styles.answer, { color: theme.colors.text }]}>{item.answer}</Text>
        </Card>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  link: {
    fontWeight: '700',
  },
  answer: {
    lineHeight: 22,
  },
});
