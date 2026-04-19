import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import type { CustomersPayload } from '../types/mobile';
import { Card, Screen } from '../components/Screen';

export function CustomersScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const [query, setQuery] = useState('');
  const [data, setData] = useState<CustomersPayload | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function load(): Promise<void> {
    if (!token) return;
    setRefreshing(true);
    try {
      setData(await api.customers(token, { q: query || undefined }));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  return (
    <Screen title="Clientes" subtitle="Carteira de clientes do web agora navegavel no app nativo." refreshing={refreshing} onRefresh={() => void load()}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={() => void load()}
        placeholder="Buscar por nome ou CNPJ"
        style={[styles.search, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text }]}
      />

      {(data?.items ?? []).map((item) => (
        <Card key={item.id}>
          <Text style={[styles.name, { color: theme.colors.text }]}>{item.nome}</Text>
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{item.cnpj_cpf || 'Sem CNPJ/CPF'}</Text>
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>{item.endereco || 'Endereco nao informado'}</Text>
          <Text style={[styles.meta, { color: theme.colors.primary }]}>
            {item.filial || 'Sem filial'} • {item.vendedor_nome || 'Sem responsavel'}
          </Text>
        </Card>
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
  name: {
    fontSize: 18,
    fontWeight: '800',
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
  },
});
