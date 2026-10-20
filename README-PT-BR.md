# Sora 3.1 + fal.ai (protótipo conectado)

Este projeto mantém a interface com a logo fornecida e conecta a geração de imagem e vídeo à fal.ai por meio de um servidor Node.js. A chave secreta fica no servidor, não no navegador.

## Modelos usados
- Imagem: `fal-ai/flux/dev`
- Vídeo: `fal-ai/bytedance/seedance/v1.5/pro/text-to-video`

A disponibilidade, os parâmetros e os preços dos modelos podem mudar. Consulte a página de cada modelo na fal.ai antes de usar. A geração pode consumir créditos.

## Publicar para abrir no Android (recomendado)
O navegador Android não executa o backend Node.js sozinho. Publique este projeto num serviço de hospedagem que suporte Node.js (por exemplo, Render ou Railway), ou execute o servidor num computador acessível. Passos gerais:

1. Crie uma conta na fal.ai e gere uma API key em https://fal.ai.
2. Publique a pasta do projeto num repositório Git privado ou público. **Não** adicione sua chave ao código nem a um repositório.
3. No serviço de hospedagem, crie um Web Service a partir do repositório.
4. Build/install command: `npm install`
5. Start command: `npm start`
6. Nas variáveis de ambiente do serviço, adicione `FAL_KEY` com sua chave real. Não use o arquivo `.env.example` para guardar a chave na nuvem.
7. Aguarde a publicação e abra o URL HTTPS fornecido no Chrome do Android.

## Testar localmente num computador
1. Instale Node.js 20 ou superior.
2. Entre nesta pasta no terminal e execute `npm install`.
3. Configure `FAL_KEY` no ambiente. Para teste local, pode copiar `.env.example` para `.env`, preencher a chave e instalar `dotenv` ou definir a variável diretamente no terminal. Este projeto não carrega `.env` automaticamente.
4. Execute `npm start` e abra `http://localhost:3000`.

## Segurança e limitações
- Nunca coloque `FAL_KEY` no HTML, JavaScript do navegador, prints ou chats.
- O endpoint é um protótipo sem login, limites de uso ou proteção contra abuso. Antes de compartilhar publicamente, adicione autenticação, rate limiting e controles de custos.
- O botão de download abre o arquivo retornado pela fal.ai; dependendo do navegador/origem do arquivo, o Chrome pode abrir a mídia em vez de baixá-la. Use o menu do navegador para baixar, se necessário.
- A geração de vídeo pode levar mais tempo e os modelos podem mudar ou deixar de estar disponíveis.
