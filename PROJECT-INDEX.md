# n8n Rocket.Chat Node - Project Index

## Overview
Community n8n node for Rocket.Chat integration, enabling workflows to send messages, upload files, and receive messages via webhook/polling/realtime WebSocket connections.

## Quick Navigation

### 📁 Core Files
- [`package.json`](./package.json) - Project metadata, dependencies, n8n configuration
- [`index.ts`](./index.ts) - Main export file
- [`tsconfig.json`](./tsconfig.json) - TypeScript configuration

### 🔑 Authentication
- [`credentials/RocketChatPat.credentials.ts`](./credentials/RocketChatPat.credentials.ts) - Personal Access Token credential type

### 📝 Nodes
- [`nodes/RocketChatMessage.node.ts`](./nodes/RocketChatMessage.node.ts) - Message operations (send/update/delete/DM)
- [`nodes/RocketChatFile.node.ts`](./nodes/RocketChatFile.node.ts) - File upload operations
- [`nodes/RocketChatTrigger.node.ts`](./nodes/RocketChatTrigger.node.ts) - Message reception (webhook/polling/realtime)

### 🚀 Transport Layer
- [`transport/GenericFunctions.ts`](./transport/GenericFunctions.ts) - Shared API utilities and helper functions

## Architecture

### Node Types
1. **RocketChatMessage** - Output node for message operations
2. **RocketChatFile** - Output node for file uploads  
3. **RocketChatTrigger** - Trigger node for receiving messages

### API Integration
- **REST API**: Standard HTTP requests for most operations
- **WebSocket**: Realtime message streaming via `stream-room-messages`
- **Form Data**: File uploads using multipart/form-data

### Key Features
- Multiple targeting modes (free text, room picker, user picker)
- Room resolution (#channel, @username, roomId)
- Direct message automation
- Thread support (tmid)
- File uploads with metadata
- Three message reception modes

## Development

### Build Commands
```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode compilation
npm run lint     # Code linting (placeholder)
```

### Dependencies
- **Runtime**: `ws` (WebSocket client)
- **Development**: `typescript`, `@types/ws`
- **Platform**: n8n node API

### File Structure
```
├── credentials/           # Authentication types
├── nodes/                # Node implementations
├── transport/            # Shared utilities
├── dist/                 # Compiled output (build)
└── package.json          # n8n node configuration
```

## API Reference

### Credentials Required
- Base URL (Rocket.Chat server)
- User ID
- Personal Access Token (PAT)
- Default Target (optional)
- Request Timeout

### Supported Operations

#### Message Node
- `post` - chat.postMessage
- `send` - chat.sendMessage (custom _id)
- `update` - chat.update
- `delete` - chat.delete
- `openDm` - im.open
- `sendDm` - im.open + postMessage

#### File Node
- File upload to rooms with optional message/description

#### Trigger Node
- `webhook` - HTTP webhook receiver
- `polling` - Periodic message polling
- `realtime` - WebSocket stream subscription

## Configuration

### n8n Package Definition
```json
{
  "n8n": {
    "credentials": ["dist/credentials/RocketChatPat.credentials.js"],
    "nodes": [
      "dist/nodes/RocketChatMessage.node.js",
      "dist/nodes/RocketChatFile.node.js", 
      "dist/nodes/RocketChatTrigger.node.js"
    ]
  }
}
```

### Key Utilities

#### Room Resolution
Supports multiple target formats:
- `roomId` - Direct room ID
- `#channel` - Channel name resolution
- `@username` - DM room creation

#### API Functions
- `rcApiRequest` - Standard REST requests
- `rcApiRequestForm` - Form data uploads
- `rcApiRequestAllItems` - Paginated data retrieval
- `resolveRoomId` - Target resolution helper

## Version Info
- **Current**: v0.2.0
- **License**: MIT
- **Authors**: Brian Tafoya & ChatGPT