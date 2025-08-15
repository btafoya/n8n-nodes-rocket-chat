# n8n-nodes-rocket-chat

[![npm version](https://img.shields.io/npm/v/n8n-nodes-rocket-chat.svg)](https://www.npmjs.com/package/n8n-nodes-rocket-chat)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![n8n community node](https://img.shields.io/badge/n8n-community%20node-blue.svg)](https://docs.n8n.io/integrations/community-nodes/)

A comprehensive **n8n community node** for **Rocket.Chat** integration, enabling powerful chat automation workflows.

## 🚀 Features

### Core Capabilities
- **Send Messages**: Post messages to channels, groups, and direct messages
- **File Upload**: Upload files to rooms with optional message attachments
- **Message Management**: Update and delete existing messages
- **Direct Messaging**: Open DM channels and send private messages
- **Real-time Triggers**: Receive messages via webhook, polling, or WebSocket

### Three Powerful Nodes

#### 🔥 **Rocket.Chat Message**
Complete message management with advanced targeting options:
- **Operations**: Post, Send (advanced), Update, Delete messages
- **Direct Messages**: Open DM channels and send private messages
- **Flexible Targeting**: Text input (#channel/@user/roomId) or dropdown selectors
- **Rich Features**: Thread replies, custom avatars, emoji support, attachments

#### 📁 **Rocket.Chat File**
Seamless file upload capabilities:
- Upload files to any room (channels, groups, DMs)
- Optional message text with file uploads
- Flexible room targeting options
- Support for various file types

#### ⚡ **Rocket.Chat Trigger**
Multiple ways to receive messages:
- **Webhook**: Real-time HTTP webhook integration
- **Polling**: Regular API polling for new messages
- **WebSocket**: Real-time stream for instant message reception
- Configurable room filtering and message processing

## 📦 Installation

### Option 1: n8n Community Nodes (Recommended)
1. Go to **Settings** → **Community Nodes** in your n8n instance
2. Install: `n8n-nodes-rocket-chat`
3. Restart n8n

### Option 2: Manual Installation
```bash
# Install in your n8n installation directory
npm install n8n-nodes-rocket-chat

# For self-hosted n8n
cd ~/.n8n/nodes
npm install n8n-nodes-rocket-chat
```

### Option 3: Docker
Add to your n8n Docker environment:
```bash
docker run -it --rm \
  -p 5678:5678 \
  -e N8N_NODES_INCLUDE="n8n-nodes-rocket-chat" \
  n8nio/n8n
```

## 🔧 Configuration

### Credentials Setup
1. In Rocket.Chat, go to **Administration** → **Personal Access Tokens**
2. Create a new Personal Access Token
3. In n8n, create new **Rocket.Chat PAT** credentials:
   - **Base URL**: Your Rocket.Chat server URL (e.g., `https://open.rocket.chat`)
   - **User ID**: Your Rocket.Chat user ID
   - **Auth Token**: The personal access token from step 2
   - **Default Target** (optional): Default channel/user for messages

### API Permissions
Ensure your Rocket.Chat user has appropriate permissions:
- `chat.postMessage` - Send messages
- `chat.update` - Update messages  
- `chat.delete` - Delete messages
- `upload-file` - Upload files
- `im.open` - Open direct messages

## 🎯 Usage Examples

### Basic Message Sending
```typescript
// Send a message to #general channel
{
  "operation": "post",
  "target": "#general", 
  "text": "Hello from n8n! 🚀"
}
```

### File Upload with Message
```typescript
// Upload file to a room
{
  "targetMode": "text",
  "target": "#announcements",
  "message": "Weekly report attached",
  "file": "{{ $binary.file }}"
}
```

### Real-time Message Trigger
```typescript
// WebSocket trigger configuration
{
  "mode": "realtime",
  "rooms": ["GENERAL", "random"],
  "includeAll": false
}
```

### Direct Message Workflow
```typescript
// Open DM and send message
{
  "operation": "sendDm",
  "dmUsername": "john.doe",
  "text": "Your task has been completed ✅"
}
```

## 🛠 Development

### Prerequisites
- Node.js 18+
- TypeScript 5+
- n8n development environment

### Build from Source
```bash
# Clone repository
git clone https://github.com/your-repo/n8n-nodes-rocket-chat.git
cd n8n-nodes-rocket-chat

# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev
```

### Project Structure
```
├── credentials/           # Authentication credentials
│   └── RocketChatPat.credentials.ts
├── nodes/                # Node implementations
│   ├── RocketChatMessage.node.ts
│   ├── RocketChatFile.node.ts
│   └── RocketChatTrigger.node.ts
├── transport/            # API utilities
│   └── GenericFunctions.ts
└── dist/                 # Compiled output
```

## 🔌 API Reference

### Rocket.Chat REST API Endpoints Used
- `POST /api/v1/chat.postMessage` - Send messages
- `POST /api/v1/chat.sendMessage` - Send messages (advanced)
- `POST /api/v1/chat.update` - Update messages
- `POST /api/v1/chat.delete` - Delete messages
- `POST /api/v1/rooms.upload` - Upload files
- `POST /api/v1/im.open` - Open direct messages
- `GET /api/v1/channels.list.joined` - List channels
- `GET /api/v1/groups.list` - List private groups
- `GET /api/v1/im.list` - List direct messages

### WebSocket Realtime API
- `stream-room-messages` - Real-time message streaming

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit: `git commit -m 'feat: add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Issues

- **Documentation**: [n8n Community Nodes Docs](https://docs.n8n.io/integrations/community-nodes/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/n8n-nodes-rocket-chat/issues)
- **Rocket.Chat API**: [Official API Documentation](https://docs.rocket.chat/reference/api)

## 🙏 Acknowledgments

- Built with ❤️ for the n8n community
- Powered by [Rocket.Chat API](https://docs.rocket.chat/reference/api)
- Compatible with n8n workflow automation platform

---

**Made possible by**: [n8n](https://n8n.io) | [Rocket.Chat](https://rocket.chat)