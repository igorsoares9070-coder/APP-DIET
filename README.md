# 🍏 Daily Diet App

## 🎯 Objetivo da Aplicação
O **Daily Diet** é um aplicativo mobile desenvolvido em React Native focado em auxiliar os usuários no controle de suas dietas diárias. O aplicativo permite o registro detalhado de refeições (nome, descrição, data e hora), indicando se cada prato está ou não dentro da dieta estabelecida. Além do CRUD completo (Criar, Ler, Atualizar e Excluir), o app oferece um painel de estatísticas (Dashboard) que calcula a porcentagem de sucesso da dieta do usuário, ajudando a manter o foco e a motivação.

## 🧩 Funcionalidades
- **Dashboard de Estatísticas:** Visão geral da porcentagem de refeições dentro da dieta, melhor sequência e totalizador.
- **Gerenciamento de Refeições:** Cadastro, edição e exclusão de refeições.
- **Listagem Agrupada:** Refeições organizadas e agrupadas por data.
- **Feedback Visual:** Cores (Verde/Vermelho) baseadas no status da refeição no *Design System*.
- **Persistência de Dados:** Uso do AsyncStorage para salvar as informações localmente no dispositivo.

## 🛠️ Tecnologias Utilizadas
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/) (Navegação em Pilha/Stack)
- [Styled-Components](https://styled-components.com/) (Estilização e Temas)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (Armazenamento Local)
- [@expo/vector-icons](https://icons.expo.fyi/Index) (Ícones)

## 🚀 Como Executar o Projeto

### Opção 1: Via Expo Snack (Navegador)
1. Acesse [snack.expo.dev](https://snack.expo.dev/).
2. Crie a estrutura de pastas conforme o código-fonte (ex: `src/screens`, `src/components`, etc).
3. Cole os respectivos códigos nos arquivos.
4. No arquivo `package.json`, certifique-se de ter as seguintes dependências:
   ```json
   "dependencies": {
     "@react-navigation/native": "*",
     "@react-navigation/native-stack": "*",
     "react-native-safe-area-context": "*",
     "react-native-screens": "*",
     "styled-components": "*",
     "@react-native-async-storage/async-storage": "*"
   }
