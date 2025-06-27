# 🌐 Budget Buddy - ngrok Setup Guide

This guide will help you set up ngrok to share your Budget Buddy expense tracker application over the internet.

## 📋 Prerequisites

- Node.js installed
- Budget Buddy project running locally
- Internet connection

## 🚀 Quick Setup

### Step 1: Install ngrok
```bash
npm install -g ngrok
```

### Step 2: Create ngrok account
1. Visit [ngrok.com/signup](https://ngrok.com/signup)
2. Sign up for a free account
3. Verify your email

### Step 3: Get your auth token
1. Go to [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)
2. Copy your auth token

### Step 4: Configure ngrok
```bash
npm run ngrok:config
```

### Step 5: Update auth token
1. Open `ngrok.yml` file
2. Replace `YOUR_NGROK_AUTH_TOKEN_HERE` with your actual auth token

### Step 6: Start development with ngrok
```bash
npm run dev:ngrok
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev:ngrok` | Start both Next.js dev server and ngrok tunnel |
| `npm run ngrok:start` | Start only ngrok tunnel (requires dev server running) |
| `npm run ngrok:config` | Create/recreate ngrok configuration |
| `npm run ngrok:help` | Show help information |

## 📱 Access Your Application

Once running, you can access your application via:

- **Local**: http://localhost:3000
- **Public**: The ngrok URL shown in the terminal (e.g., https://expense-tracker-demo.ngrok.io)
- **ngrok Web Interface**: http://localhost:4040 (for monitoring requests)

## 🔧 Configuration Details

The `ngrok.yml` configuration includes:

- **Port**: 3000 (Next.js default)
- **Protocol**: HTTP with HTTPS binding
- **Subdomain**: expense-tracker-demo (requires paid plan)
- **Inspection**: Enabled for debugging

## 🆓 Free vs Paid Features

### Free Account Includes:
- Random public URLs
- Basic HTTP/HTTPS tunnels
- Request inspection
- 1 online ngrok process

### Paid Account Adds:
- Custom subdomains
- Reserved domains
- Multiple simultaneous tunnels
- Password protection
- IP whitelisting

## 🔒 Security Considerations

1. **Environment Variables**: Your `.env.local` file is not exposed
2. **Database**: Ensure your MongoDB is properly secured
3. **Auth Tokens**: Keep your ngrok auth token private
4. **Public Access**: Remember that your tunnel is publicly accessible

## 🐛 Troubleshooting

### Common Issues:

1. **"command not found: ngrok"**
   ```bash
   npm install -g ngrok
   ```

2. **"tunnel session failed: authentication failed"**
   - Check your auth token in `ngrok.yml`
   - Ensure you've copied it correctly from the dashboard

3. **"tunnel session failed: account limit exceeded"**
   - You may have another ngrok process running
   - Kill existing ngrok processes: `pkill ngrok`

4. **Next.js server not starting**
   - Check if port 3000 is available
   - Try running `npm run dev` separately first

### Getting Help:

1. Check ngrok logs in the terminal
2. Visit ngrok web interface at http://localhost:4040
3. Check ngrok documentation: https://ngrok.com/docs

## 📊 Monitoring

The ngrok web interface (http://localhost:4040) provides:

- Real-time request logs
- Response details
- Performance metrics
- Replay requests for testing

## 🔄 Stopping Services

To stop both the development server and ngrok tunnel:
- Press `Ctrl+C` in the terminal where `npm run dev:ngrok` is running

## 🌟 Tips for Sharing

1. **Share the HTTPS URL**: Always use the https:// version for security
2. **Test thoroughly**: Check all features work through the tunnel
3. **Monitor usage**: Use the web interface to see who's accessing your app
4. **Temporary sharing**: Remember that free ngrok URLs change each restart

## 📞 Support

If you encounter issues:
1. Check this README
2. Review ngrok documentation
3. Check the project's main README.md
4. Contact the development team

---

Happy sharing! 🎉
