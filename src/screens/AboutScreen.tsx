import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { AboutPayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function AboutScreen(): React.JSX.Element {
  const { token } = useAuth();
  const [data, setData] = useState<AboutPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) {
      return;
    }

    setRefreshing(true);
    try {
      setData(await api.about(token));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Sobre o app" subtitle="Base preparada para publicacao futura e reaproveitamento entre empresas." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Aplicativo</Label>
        <Value>{data?.name ?? '-'}</Value>
        <Text>{data?.description ?? '-'}</Text>
        <Label>Empresa</Label>
        <Value>{data?.company.company_name ?? '-'}</Value>
      </Card>

      <Card>
        <Label>Coleta de dados</Label>
        {(data?.privacy.collects ?? []).map((item) => (
          <Text key={item}>• {item}</Text>
        ))}
        <Label>O que nao coletamos</Label>
        {(data?.privacy.does_not_collect ?? []).map((item) => (
          <Text key={item}>• {item}</Text>
        ))}
      </Card>
    </Screen>
  );
}
