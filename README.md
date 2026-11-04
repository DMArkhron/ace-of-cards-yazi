# 🃏 Fabula Ultima — Ace of Cards

Leve o baralho da classe **Ace of Cards — Ás das Cartas** ao Foundry VTT. Compre cartas, organize sua mão, prepare combinações e compartilhe as jogadas em cards visuais no chat.

Este é um **módulo independente e não oficial**, desenvolvido por **DM Arkhron** para **ProjectFU**. Fabula Ultima e ProjectFU pertencem aos respectivos criadores.

## ✨ Por que usar?

Acompanhe mão, monte, descarte e Vanguarda em uma única janela. Selecione as cartas para consultar as combinações disponíveis e revisar o efeito antes de jogar. O baralho fica salvo no personagem entre cenas, combates e sessões, até você decidir reiniciá-lo.

## 🎯 Principais recursos

- 🃏 **Baralho de 30 cartas** — Quatro naipes elementais, Terra, Ar, Fogo e Gelo, numerados de 1 a 7, mais dois coringas.
- ✋ **Mão inicial de cinco cartas** — Inicie ou reinicie o baralho com as cartas reunidas e embaralhadas.
- 🎴 **Compra e descarte** — Compre cartas do monte e descarte a seleção. Quando o monte acaba, o descarte é embaralhado para continuar as compras.
- 🔮 **Reconhecimento de combinações** — Selecione de duas a cinco cartas para consultar as jogadas que elas formam e a descrição dos efeitos.
- ✨ **Coringas ajustáveis** — Veja uma atribuição sugerida de valor e naipe para a combinação e ajuste conforme necessário.
- 🛡️ **Área de Vanguarda** — Reserve até três cartas e clique nelas para revelar e mover ao descarte.
- 💬 **Chat personalizado** — Publique o nome da combinação, as cartas utilizadas e a descrição do efeito.
- 🎨 **Ícones do ProjectFU** — Cartas com os elementos do sistema e coringas com o símbolo de Ponto de Última.
- 👤 **Escolha visual de personagem** — Abra o baralho pela aba Baralhos e escolha um personagem pela lista com retratos.
- 💾 **Estado persistente** — Continue com a mesma mão e as mesmas pilhas ao trocar de cena, terminar um combate ou reiniciar o Foundry.

## ⚙️ Compatibilidade

| Requisito | Versão |
| --- | --- |
| Foundry VTT | V13 |
| Sistema de jogo | ProjectFU |
| Ace of Cards | **0.2.6** |
| Idioma da interface | Português, com nomes de combinações em inglês |

O módulo requer um mundo com **ProjectFU**. Um mestre deve estar conectado para processar as alterações do baralho feitas pelos jogadores.

A automação controla as cartas e publica os resultados no chat. **PV, PM, condições, ataques e alvos continuam sendo aplicados pela mesa.** O módulo não verifica automaticamente se o personagem possui a classe ou as habilidades opcionais; consulte as regras oficiais para custos e requisitos.

## 📦 Instalação

1. Na tela inicial do Foundry, abra **Módulos adicionais → Instalar módulo**.
2. Cole o endereço abaixo no campo **URL do manifesto**.
3. Clique em **Instalar** e aguarde o download.
4. Entre no mundo ProjectFU e ative **Fabula Ultima - Ace of Cards - DM Arkhron** em **Gerenciar módulos**.

```text
https://raw.githubusercontent.com/DMArkhron/ace-of-cards-yazi/main/module.json
```

### Instalação manual

1. Baixe o pacote [ace-of-cards-v0.2.6.zip](https://raw.githubusercontent.com/DMArkhron/ace-of-cards-yazi/main/dist/ace-of-cards-v0.2.6.zip).
2. Com o Foundry fechado, extraia o conteúdo em `Data/modules/fu-deck-ace-of-cards-dmarkhron/`.
3. Confira se o manifesto está em `Data/modules/fu-deck-ace-of-cards-dmarkhron/module.json`.
4. Abra o Foundry e ative o módulo no mundo ProjectFU.

## 🎮 Primeiros passos

1. Abra a aba **Baralhos** da barra lateral e clique em **Ás das Cartas — abrir baralho**.
2. Se houver um token de personagem selecionado, o baralho dele será aberto. Caso contrário, escolha um personagem na lista.
3. No primeiro acesso, clique em **Embaralhar e comprar 5 cartas**.
4. Clique nas cartas da mão para selecioná-las e consulte a área **Jogada**.
5. Escolha uma combinação disponível, confira o efeito e clique em **Jogar cartas**.
6. Use o painel **Vanguarda, descarte e controles** para consultar as pilhas ou reiniciar o baralho.

### Macro de acesso

Crie uma macro do tipo **Script** e use:

```js
game.modules.get("fu-deck-ace-of-cards-dmarkhron").api.openMyDeck()
```

A macro usa o primeiro token selecionado ou o personagem atribuído ao usuário do Foundry.

## 🔄 Atualizações

Consulte as notas da Release antes de atualizar e faça uma cópia de segurança do mundo.

Se você utilizava o módulo antigo **ace-yazi**, desative-o antes de ativar esta versão. Desde a **0.2.5**, a pasta e o identificador são `fu-deck-ace-of-cards-dmarkhron`. Os baralhos antigos são lidos dos dados dos personagens e gravados no novo identificador na próxima alteração.

## 🐛 Problemas e sugestões

Encontrou um erro ou tem uma ideia de melhoria? Abra uma [**Issue**](https://github.com/DMArkhron/ace-of-cards-yazi/issues), incluindo, quando possível:

- As versões do Foundry VTT, ProjectFU e deste módulo.
- Os passos para reproduzir o problema.
- Uma captura de tela ou mensagem do console.
- Os outros módulos ativos no mundo.

## 👤 Créditos

**Módulo para Foundry VTT desenvolvido por DM Arkhron.**

**Fabula Ultima** é uma criação de **Emanuele Galletto**, publicada por **Need Games e Rooster Games**. O uso deste módulo requer as regras oficiais da classe.

Os ícones elementais e de Ponto de Última são carregados da instalação do **ProjectFU**, sem cópias das imagens neste pacote. Os direitos sobre a obra original e os materiais de terceiros permanecem com seus respectivos titulares.

Este projeto não é afiliado, endossado ou publicado oficialmente por Need Games, Rooster Games ou pela equipe ProjectFU.
