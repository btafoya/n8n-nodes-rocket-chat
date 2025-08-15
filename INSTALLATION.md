# n8n-nodes-rocket-chat Installation Guide

## 🚀 Installation Methods

### Method 1: n8n GUI (Recommended)
1. **Open n8n** and go to **Settings**
2. **Navigate** to **Community Nodes**
3. **Install** by entering: `n8n-nodes-rocket-chat`
4. **Restart n8n** to activate the nodes

### Method 2: Manual Installation (Self-hosted)
```bash
# Navigate to your n8n installation directory
cd ~/.n8n/

# Install the community node
npm install n8n-nodes-rocket-chat

# Restart n8n
```

### Method 3: Docker Environment
```bash
# Add to your docker-compose.yml or run command
docker run -it --rm \
  -p 5678:5678 \
  -e N8N_NODES_INCLUDE="n8n-nodes-rocket-chat" \
  n8nio/n8n
```

### Method 4: Environment Variable (Docker/K8s)
```bash
# Add to your environment variables
N8N_NODES_INCLUDE="n8n-nodes-rocket-chat"
```

## 🔧 After Installation

### 1. Setup Credentials
- **Go to**: Credentials in n8n
- **Create**: New "Rocket.Chat PAT" credential
- **Configure**:
  - Base URL: Your Rocket.Chat server (e.g., `https://open.rocket.chat`)
  - User ID: Your Rocket.Chat user ID
  - Auth Token: Your Personal Access Token
  - Default Target: Optional default channel/user

### 2. Available Nodes
After installation, you'll find these new nodes:
- **🔥 Rocket.Chat Message**: Send, update, delete messages
- **📁 Rocket.Chat File**: Upload files to rooms
- **⚡ Rocket.Chat Trigger**: Receive messages via webhook/polling/realtime

### 3. First Workflow
Create a simple test workflow:
1. **Add** a "Manual Trigger" node
2. **Add** a "Rocket.Chat Message" node
3. **Connect** them
4. **Configure** the message node with your credentials
5. **Test** by sending a message to #general

## 🔍 Finding the Nodes
In the n8n node panel, search for:
- "Rocket.Chat" or "rocket" to find all nodes
- Look under the "Communication" category

## 🆘 Troubleshooting

### Node Not Appearing
- Ensure n8n version is 1.0.0+ for community nodes
- Restart n8n after installation
- Check n8n logs for installation errors

### Authentication Issues
- Verify your Rocket.Chat server URL (include https://)
- Confirm Personal Access Token has proper permissions
- Test credentials with a simple API call

### Docker Issues
- Ensure the N8N_NODES_INCLUDE environment variable is set
- Check that the container has internet access to download from npm

## 📞 Support
- **Documentation**: [GitHub Repository](https://github.com/btafoya/n8n-nodes-rocket-chat)
- **Issues**: [Report Issues](https://github.com/btafoya/n8n-nodes-rocket-chat/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io)