# API Reference - n8n Rocket.Chat Node

## Credentials Configuration

### RocketChatPat
Personal Access Token authentication for Rocket.Chat API access.

**Required Fields:**
- `baseUrl` (string) - Rocket.Chat server URL (e.g., `https://chat.example.com`)
- `userId` (string) - User ID owning the PAT (e.g., `rbAXPnMktTFbNpwtJ`)
- `authToken` (string, password) - Personal Access Token
- `defaultTarget` (string) - Default channel/user when target omitted
- `timeout` (number) - Request timeout in milliseconds (default: 30000)

## Node Operations

### RocketChatMessage Node

#### Operations

##### Post Message (`post`)
Send message using `chat.postMessage` endpoint.

**Parameters:**
- `target` - Room/channel/user identifier
- `text` - Message content
- `tmid` - Thread message ID (optional)
- `additionalFields`:
  - `alias` - Display name override
  - `emoji` - Emoji avatar
  - `avatar` - Avatar URL
  - `parseUrls` - Parse URLs in message (boolean)
  - `attachments` - Raw JSON attachment array

**API Endpoint:** `POST /api/v1/chat.postMessage`

##### Send Message (`send`)
Advanced message sending with custom ID support.

**Parameters:** Same as Post Message
**API Endpoint:** `POST /api/v1/chat.sendMessage`

##### Update Message (`update`)
Modify existing message content.

**Parameters:**
- `target` - Room identifier
- `msgId` - Message ID to update
- `newText` - Replacement text content

**API Endpoint:** `POST /api/v1/chat.update`

##### Delete Message (`delete`)
Remove message from room.

**Parameters:**
- `target` - Room identifier  
- `msgId` - Message ID to delete

**API Endpoint:** `POST /api/v1/chat.delete`

##### Open DM (`openDm`)
Open direct message room with user.

**Parameters:**
- `dmUsername` - Target username

**API Endpoint:** `POST /api/v1/im.open`

##### Send DM (`sendDm`)
Combined DM opening and message sending.

**Parameters:**
- `dmUsername` - Target username
- `text` - Message content
- `tmid` - Thread ID (optional)
- `additionalFields` - Same as Post Message

**API Flow:** `im.open` → `chat.postMessage`

#### Target Resolution

**Target Modes:**
- `text` - Free text input (roomId/#channel/@username)
- `pickerRoom` - Room selection dropdown
- `pickerUser` - User selection dropdown (@username)

**Resolution Logic:**
1. **Room ID**: Direct usage if no # or @ prefix
2. **Channel (#channel)**: Resolve via `channels.info` by roomName
3. **Username (@username)**: Open DM via `im.open`, use returned roomId

### RocketChatFile Node

#### File Upload Operation
Upload files to rooms with optional message and metadata.

**Parameters:**
- `targetMode` - text | pickerRoom
- `room`/`roomPicker` - Target room identifier
- `binaryPropertyName` - Input binary property name (default: "data")
- `msg` - Optional message text
- `description` - File description
- `tmid` - Thread ID

**API Endpoint:** `POST /api/v1/rooms.upload/{roomId}`
**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` - Binary file data
- `msg` - Message text (optional)
- `description` - File description (optional)
- `tmid` - Thread ID (optional)

### RocketChatTrigger Node

#### Webhook Mode (`webhook`)
Receive messages via HTTP webhook.

**Parameters:**
- `ack` - Acknowledge immediately (boolean)

**Webhook Configuration:**
- **Path:** `/rocketchat`
- **Method:** `POST`
- **Response Mode:** `onReceived`

#### Polling Mode (`polling`)
Periodically fetch new messages from room.

**Parameters:**
- `pollRoom` - Room to monitor
- `interval` - Polling interval in seconds (minimum: 5)

**API Endpoints (tried in order):**
1. `GET /api/v1/channels.history`
2. `GET /api/v1/groups.history`
3. `GET /api/v1/im.history`

**Query Parameters:**
- `roomId` - Target room ID
- `count` - Message limit (50)
- `unreads` - Include unread messages
- `oldest` - Timestamp for incremental polling

#### Realtime Mode (`realtime`)
WebSocket connection for live message streaming.

**Parameters:**
- `rtRoomId` - Room ID to subscribe to

**WebSocket Flow:**
1. Connect to `{baseUrl}/websocket`
2. Send connect message with DDP protocol
3. Authenticate using resume token (authToken)
4. Subscribe to `stream-room-messages` for room
5. Receive messages via `changed` events

**Protocol:** DDP (Distributed Data Protocol)

## Transport Layer API

### Core Functions

#### `rcApiRequest(method, endpoint, body, qs, options)`
Standard REST API request wrapper.

**Headers:**
- `X-Auth-Token` - Authentication token
- `X-User-Id` - User ID
- `Content-Type: application/json`

**Returns:** Parsed JSON response

#### `rcApiRequestForm(endpoint, formData, qs, options)`
Form data upload wrapper for file operations.

**Headers:**
- `X-Auth-Token` - Authentication token
- `X-User-Id` - User ID

**Returns:** Parsed JSON response

#### `rcApiRequestAllItems(endpoint, listKey, query, max)`
Paginated data retrieval with automatic pagination.

**Parameters:**
- `endpoint` - API endpoint
- `listKey` - Response array property name
- `query` - Base query parameters
- `max` - Maximum items to retrieve (default: 500)

**Pagination:** Uses `offset` and `count` parameters (100 per page)

#### `resolveRoomId(target)`
Target resolution utility supporting multiple formats.

**Supported Formats:**
- `roomId` - Direct room ID (no transformation)
- `#channel` - Channel name → room ID via `channels.info`
- `@username` - Username → DM room ID via `im.open`

**Returns:** Resolved room ID string

#### `toUnixOrDate(val)`
Date normalization utility.

**Input:** string | number | Date
**Output:** ISO string or undefined

## Error Handling

### Common Error Patterns
- **Invalid credentials**: 401 Unauthorized
- **Room not found**: 404 for channels.info
- **User not found**: Error from im.open
- **Permission denied**: 403 for restricted operations
- **Network timeout**: Configurable timeout (default: 30s)

### Fallback Strategies
- **History endpoints**: Try channels → groups → im
- **Target resolution**: Validate format before API calls
- **WebSocket reconnection**: Manual connection management required

## Rate Limiting
- **Default timeout**: 30 seconds per request
- **Polling minimum**: 5 seconds interval
- **WebSocket**: Single persistent connection per trigger

## Rocket.Chat API Compatibility
- **Minimum version**: Rocket.Chat 3.0+
- **Authentication**: Personal Access Token (PAT) required
- **Permissions**: Based on user's Rocket.Chat permissions
- **Features**: Supports channels, private groups, direct messages