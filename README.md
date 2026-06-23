# 📬 Notification Service

Serviço de notificações em tempo real com WebSocket e envio de e-mails via SendGrid.

## 🚀 Tecnologias

- **Node.js** + **Express** — servidor HTTP e rotas REST
- **WebSocket (ws)** — notificações em tempo real
- **SendGrid** — envio de e-mails transacionais
- **PostgreSQL** — persistência do histórico de notificações
- **Docker** — containerização da aplicação e banco de dados

## 📁 Estrutura do projeto

```
notification-service/
├── src/
│   ├── server.js       # Ponto de entrada, rotas e inicialização
│   ├── websocket.js    # Gerenciamento de conexões WebSocket
│   ├── email.js        # Integração com SendGrid
│   └── db.js           # Conexão com PostgreSQL via pool
├── .env                # Variáveis de ambiente (não commitado)
├── .env.example        # Modelo de variáveis de ambiente
├── Dockerfile          # Imagem Docker da aplicação
├── docker-compose.yml  # Orquestração dos containers
└── package.json
```

## ⚙️ Pré-requisitos

- [Node.js](https://nodejs.org) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Conta no [SendGrid](https://sendgrid.com) com Sender verificado

## 🔧 Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/notification-service.git
cd notification-service
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
SENDGRID_API_KEY=SG.sua_chave_aqui
EMAIL_FROM=seuemail@gmail.com
DATABASE_URL=postgresql://user:senha123@db:5432/notifications
PORT=3000
```

### 3. Suba os containers

```bash
docker compose up -d
```

### 4. Crie a tabela no banco

```bash
docker compose exec db psql -U user -d notifications -c "
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  status VARCHAR(50) DEFAULT 'sent',
  created_at TIMESTAMP DEFAULT NOW()
);"
```

### 5. Verifique os logs

```bash
docker compose logs api
```

Deve aparecer: `Servidor rodando na porta 3000`

## 📡 Endpoints

### `POST /notify`

Envia uma notificação em tempo real via WebSocket e por e-mail.

**Request:**

```json
{
  "userId": "123",
  "email": "destino@email.com",
  "subject": "Assunto do e-mail",
  "message": "Conteúdo da notificação"
}
```

**Response:**

```json
{
  "ok": true
}
```

## 🔌 WebSocket

Clientes se conectam informando o `userId` como query param:

```js
const ws = new WebSocket("ws://localhost:3000?userId=123");

ws.onmessage = (event) => {
  const notification = JSON.parse(event.data);
  console.log(notification);
  // { type: 'NOTIFICATION', message: 'Conteúdo da notificação' }
};
```

Quando um `POST /notify` é disparado para esse `userId`, a mensagem aparece instantaneamente no cliente conectado.

## 🧪 Testando com Postman

1. Método: `POST`
2. URL: `http://localhost:3000/notify`
3. Body → raw → JSON:

```json
{
  "userId": "123",
  "email": "seuemail@gmail.com",
  "subject": "Teste",
  "message": "Funcionou!"
}
```

Para testar o WebSocket, acesse [hoppscotch.io](https://hoppscotch.io) → Realtime → WebSocket e conecte em `ws://localhost:3000?userId=123`.

## 🔒 Segurança

- Credenciais gerenciadas via variáveis de ambiente
- `.env` protegido pelo `.gitignore`
- Parâmetros de banco de dados com placeholders (`$1`, `$2`) para prevenir SQL Injection

## 📄 Licença

MIT
