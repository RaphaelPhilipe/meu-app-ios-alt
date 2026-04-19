import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { ProfilePayload } from '../types/mobile';
import { Card, Label, Screen, Value } from '../components/Screen';

export function ProfileScreen(): React.JSX.Element {
  const { token } = useAuth();
  const [data, setData] = useState<ProfilePayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) {
      return;
    }

    setRefreshing(true);
    try {
      setData(await api.profile(token));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Perfil" subtitle="Conta sincronizada com o backend atual." refreshing={refreshing} onRefresh={() => void load()}>
      <Card>
        <Label>Nome</Label>
        <Value>{data?.user.nome ?? '-'}</Value>
        <Label>Login</Label>
        <Value>{data?.account.login ?? '-'}</Value>
        <Label>Perfil</Label>
        <Value>{data?.account.role ?? '-'}</Value>
        <Label>Filial</Label>
        <Value>{data?.account.branch ?? '-'}</Value>
      </Card>
    </Screen>
  );
}
