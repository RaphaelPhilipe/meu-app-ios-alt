import React from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Card, Label, Screen, Value } from '../components/Screen';
import { useAuth } from '../contexts/AuthContext';
import { environment } from '../config/environment';

export function PlaceholderModuleScreen(): React.JSX.Element {
  const { token, theme } = useAuth();
  const route = useRoute<RouteProp<Record<string, { module?: { label?: string; web_route?: string } }>, string>>();
  const module = route.params?.module;

  async function openWebModule(): Promise<void> {
    if (!token || !module?.web_route) {
      Alert.alert('Indisponivel', 'Nao foi possivel abrir este modulo agora.');
      return;
    }

    const redirect = encodeURIComponent(module.web_route);
    const url = `${environment.apiBaseUrl}/api/mobile/auth/web-session?token=${encodeURIComponent(token)}&redirect=${redirect}`;
    await Linking.openURL(url);
  }

  return (
    <Screen
      title={module?.label ?? 'Modulo'}
      subtitle="Esta area ja esta prevista no app nativo, mas ainda depende da migracao do backend legado para API dedicada."
    >
      <Card>
        <Label>Status</Label>
        <Value>Pronto para migracao</Value>
        <Text>
          O menu, a rota interna e a configuracao multiempresa ja foram preparados. O proximo passo e transformar o fluxo web em endpoints mobile antes de liberar esta tela para producao.
        </Text>
        <Label>Origem atual no web</Label>
        <Value>{module?.web_route ?? 'Nao mapeado'}</Value>
        {module?.web_route ? (
          <Pressable onPress={() => void openWebModule()} style={[styles.button, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.buttonLabel}>Abrir modulo web autenticado</Text>
          </Pressable>
        ) : null}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '800',
  },
});
