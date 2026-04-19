import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../contexts/AuthContext';
import { brandAssets } from '../assets/branding';

export function LoginScreen(): React.JSX.Element {
  const { signIn, theme, bootstrap } = useAuth();
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(): Promise<void> {
    if (!login.trim() || !senha.trim()) {
      Alert.alert('Campos obrigatorios', 'Informe usuario e senha para continuar.');
      return;
    }

    try {
      setLoading(true);
      await signIn(login, senha);
    } catch (error) {
      Alert.alert('Falha no login', error instanceof Error ? error.message : 'Nao foi possivel autenticar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.page}
    >
      <ImageBackground source={brandAssets.hero} resizeMode="cover" style={styles.backdrop} imageStyle={styles.backdropImage}>
        <View style={styles.panel}>
          <Image source={brandAssets.logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.kicker}>{bootstrap?.branding.company_name ?? 'SIGEV Mobile'}</Text>
          <Text style={styles.title}>Operacao nativa para iPhone</Text>
          <Text style={styles.subtitle}>
            Entrando com a mesma conta do sistema web, mas em uma base preparada para App Store e crescimento por modulos.
          </Text>

          <TextInput
            placeholder="Usuario"
            value={login}
            autoCapitalize="none"
            onChangeText={setLogin}
            style={styles.input}
          />
          <TextInput
            placeholder="Senha"
            value={senha}
            secureTextEntry
            onChangeText={setSenha}
            style={styles.input}
          />

          <Pressable onPress={() => void handleLogin()} style={styles.button}>
            {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonLabel}>Entrar</Text>}
          </Pressable>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backdropImage: {
    opacity: 0.22,
  },
  panel: {
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: 32,
    padding: 24,
    gap: 14,
  },
  logo: {
    width: 146,
    height: 54,
    marginBottom: 6,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#47604b',
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    color: '#162313',
  },
  subtitle: {
    color: '#506050',
    lineHeight: 22,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f4f7f1',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#162313',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonLabel: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 16,
  },
});
