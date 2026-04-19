# SIGEV Native iOS

Base nativa orientada a API para substituir gradualmente o app baseado em WebView e preparar publicacao futura na App Store.

## O que esta pronto

- autenticacao com `api/mobile/auth/login`
- restauracao de sessao com token bearer
- bootstrap remoto com branding e menu por empresa
- menu hamburguer baseado em configuracao do backend
- dashboard, visitas, detalhe da visita, perfil, configuracoes, ajuda e sobre
- modulos nativos iniciais para notificacoes, agenda, clientes, ocorrencias e reajuste de frete
- ponte autenticada para abrir modulos ainda legados no web usando `api/mobile/auth/web-session`

## Estrutura

```text
mobile/native-ios/
  App.tsx
  src/
    components/
    config/
    contexts/
    navigation/
    screens/
    services/
    types/
```

## Como replicar para outros SIGEV

1. Ajustar `app/config/branding.php` no backend da empresa.
2. Ajustar `app/config/modulos.php` para habilitar ou ocultar modulos.
3. Ajustar `app/config/mobile.php` com bundle id, suporte e URLs.
4. Reaproveitar a mesma base do app e trocar apenas:
   - `src/config/environment.ts`
   - `app.json`
   - icones e splash

## Proximo passo recomendado

Migrar os modulos grandes do legado para endpoints mobile dedicados nesta ordem:

1. notificacoes
2. agenda
3. ocorrencias
4. reajuste de frete
5. clientes
6. positivacao
7. relatorios
8. oportunidades

## Observacao

As dependencias do `package.json` formam uma base inicial do projeto. No momento da primeira instalacao, vale alinhar as versoes com o SDK Expo adotado no seu ambiente Mac de build.

## Codemagic

- workflow pronto em `codemagic.yaml`
- bundle id ajustado para `com.sigevalt.mobile`
- assets do SIGEV ALT copiados para `assets/`
