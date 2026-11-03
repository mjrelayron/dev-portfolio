# 🤖 YouTube API Automation System

Fully automated YouTube API key management with quota exhaustion detection and automatic key generation.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the API Key Server
```bash
npm run youtube:server
```

### 3. Start Your App
```bash
npm run dev
```

**That's it!** The system will automatically:
- ✅ Detect when API quota is exceeded
- ✅ Generate new API keys automatically
- ✅ Switch to new keys seamlessly
- ✅ Continue loading unlimited videos

## 🔧 Manual Commands

### API Key Management
```bash
# Add new API key (interactive)
npm run youtube:add

# List all API keys
npm run youtube:list

# Rotate to next available key
npm run youtube:rotate

# Test current API key
npm run youtube:test

# Show Google Cloud SDK setup
npm run youtube:setup

# Generate key automatically
npm run youtube:auto
```

### Server Management
```bash
# Start API key generation server
npm run youtube:server

# Health check
curl http://localhost:3001/health

# Generate new key via API
curl -X POST http://localhost:3001/generate

# Rotate keys via API
curl -X POST http://localhost:3001/rotate
```

## 🏗️ Architecture

### Components

1. **WorkflowChallenger.jsx** - Main React component
   - Detects API quota exhaustion
   - Automatically calls key generation
   - Seamless key rotation
   - UI status indicators

2. **api-key-server.js** - Express server
   - HTTP endpoints for key management
   - Google Cloud SDK integration
   - Automatic key generation
   - Key rotation logic

3. **auto-generate-api.js** - Standalone generator
   - Command-line key generation
   - Google Cloud SDK automation
   - Environment file updates

4. **generate-youtube-api.js** - Interactive CLI
   - Manual key management
   - Setup instructions
   - Key testing and validation

### Data Flow

```
API Quota Exceeded → Frontend Detection → Server Call → Google Cloud SDK → New Key → Auto-Rotation → Continue Loading
```

## 🔑 Google Cloud Setup

### Prerequisites
1. **Google Cloud Account** - [Create here](https://cloud.google.com/)
2. **Google Cloud SDK** - Install with:
   ```bash
   # Windows
   winget install Google.CloudSDK
   
   # Mac
   brew install --cask google-cloud-sdk
   
   # Linux
   curl https://sdk.cloud.google.com | bash
   ```

### Project Setup
```bash
# 1. Login to Google Cloud
gcloud auth login

# 2. Create or select project
gcloud config set project YOUR_PROJECT_ID

# 3. Enable YouTube Data API
gcloud services enable youtube.googleapis.com

# 4. Set up billing (required for API usage)
# Go to: https://console.cloud.google.com/billing
```

### Environment Variables
Create `.env.local`:
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
VITE_YOUTUBE_API_KEY=your-api-key
API_KEY_SERVER_PORT=3001
```

## 🤖 Automation Features

### Automatic Detection
- **Quota Monitoring**: Real-time API quota tracking
- **Error Detection**: Automatic 403 error detection
- **Status Updates**: UI shows current API status

### Automatic Generation
- **Google Cloud SDK**: Direct integration with gcloud CLI
- **Key Creation**: Automatic API key generation
- **Testing**: Validates keys before use
- **Rotation**: Seamless key switching

### Smart Fallback
- **Multiple Keys**: Supports unlimited API keys
- **Automatic Rotation**: Switches when quota hit
- **Error Recovery**: Handles generation failures
- **User Notifications**: Clear status messages

## 📊 Status Indicators

| Status | Icon | Description |
|--------|------|-------------|
| Ready | ⚪ | System ready |
| Cached | 📚 | Using cached videos |
| YouTube | 🌐 | Using YouTube API |
| Generating | 🤖 | Creating new key |
| Exhausted | 🚫 | All keys exhausted |

## 🔧 Configuration

### API Key Server
- **Port**: 3001 (configurable)
- **CORS**: Enabled for frontend
- **Health Check**: `/health`
- **Generate**: `POST /generate`
- **Rotate**: `POST /rotate`

### Key Storage
- **Location**: `config/youtube-api-keys.json`
- **Format**: JSON with metadata
- **Security**: Local storage only
- **Backup**: Automatic versioning

### Environment Files
- **Primary**: `.env.local`
- **Fallback**: Environment variables
- **Auto-Update**: Server updates files
- **Validation**: Key format checking

## 🚨 Troubleshooting

### Common Issues

#### 1. Google Cloud SDK Not Found
```bash
# Install SDK
npm run youtube:setup

# Or manually
winget install Google.CloudSDK  # Windows
brew install --cask google-cloud-sdk  # Mac
```

#### 2. Authentication Failed
```bash
# Re-authenticate
gcloud auth login
gcloud auth application-default login
```

#### 3. API Key Generation Failed
```bash
# Check project
gcloud config get-value project

# Enable API
gcloud services enable youtube.googleapis.com

# Check billing
gcloud billing accounts list
```

#### 4. Server Connection Failed
```bash
# Start server
npm run youtube:server

# Check health
curl http://localhost:3001/health
```

### Debug Commands
```bash
# Test current setup
npm run youtube:test

# List all keys
npm run youtube:list

# Check server status
curl http://localhost:3001/health

# Manual key generation
npm run youtube:auto
```

## 📈 Performance

### Optimization
- **Cached Videos**: 12 initial + 3 per scroll
- **Smart Loading**: Only when needed
- **Key Rotation**: Automatic fallback
- **Error Recovery**: Graceful degradation

### Monitoring
- **Console Logs**: Detailed debugging
- **Status Updates**: Real-time feedback
- **Error Tracking**: Automatic reporting
- **Usage Stats**: Key usage monitoring

## 🔒 Security

### Key Management
- **Local Storage**: Keys stored locally
- **No External Services**: Self-contained
- **Environment Variables**: Secure configuration
- **Automatic Cleanup**: Old keys removed

### Access Control
- **Local Server**: No external access
- **CORS Protection**: Frontend only
- **Key Validation**: Format checking
- **Error Handling**: Secure error messages

## 🎯 Usage Examples

### Basic Usage
1. Start server: `npm run youtube:server`
2. Start app: `npm run dev`
3. Use normally - automation handles everything!

### Advanced Usage
```bash
# Add multiple keys
npm run youtube:add
npm run youtube:add
npm run youtube:add

# Monitor status
npm run youtube:list

# Manual rotation
npm run youtube:rotate

# Test setup
npm run youtube:test
```

### API Integration
```javascript
// Generate new key
const response = await fetch('http://localhost:3001/generate', {
  method: 'POST'
});

// Rotate keys
const rotate = await fetch('http://localhost:3001/rotate', {
  method: 'POST'
});

// Check status
const status = await fetch('http://localhost:3001/health');
```

## 🚀 Production Deployment

### Environment Setup
```bash
# Set production project
export GOOGLE_CLOUD_PROJECT_ID=your-prod-project

# Start server
npm run youtube:server

# Deploy with PM2
pm2 start scripts/api-key-server.js --name youtube-api-server
```

### Monitoring
- **Health Checks**: Regular endpoint monitoring
- **Key Rotation**: Automated key management
- **Error Alerts**: Quota exhaustion notifications
- **Usage Tracking**: API usage monitoring

## 📚 API Reference

### Endpoints

#### `GET /health`
Check server status
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### `GET /keys`
List all API keys
```json
{
  "success": true,
  "keys": [...],
  "total": 3,
  "current": "AIzaSy..."
}
```

#### `POST /generate`
Generate new API key
```json
{
  "success": true,
  "message": "New API key generated successfully",
  "key": "AIzaSy...",
  "totalKeys": 4
}
```

#### `POST /rotate`
Rotate to next key
```json
{
  "success": true,
  "message": "API key rotated successfully",
  "key": "AIzaSy...",
  "totalKeys": 3
}
```

## 🎉 Success!

Your YouTube API automation system is now fully operational! The system will:

- ✅ **Automatically detect** API quota exhaustion
- ✅ **Generate new keys** when needed
- ✅ **Rotate keys** seamlessly
- ✅ **Continue loading** unlimited videos
- ✅ **Provide clear feedback** to users

**No more manual API key management required!** 🚀









