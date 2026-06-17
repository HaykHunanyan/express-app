# Express App

A simple Node.js + Express starter.

## Setup

```bash
cd express-app
npm install
```

## Run

```bash
npm start      # runs node app.js
npm run dev    # auto-restarts on file changes (Node 18+)
```

Then open http://localhost:3000

## Routes

- `GET /` — returns a plain text greeting
- `GET /api/health` — returns server status as JSON
- `GET /api/greet/:name` — returns a personalized greeting as JSON
- `POST /api/upload` — accepts `multipart/form-data` (a `FormData` body). Returns the submitted fields and metadata for any uploaded files.
- `POST /api/send-to-telegram` — accepts up to 2 images and forwards them to your Telegram channel as uncompressed documents (full quality), grouped as an album.

### Telegram setup

Requires Node 18+ (uses the built-in `fetch`/`FormData`). Set these environment variables before starting:

```bash
export BOT_TOKEN="123456:your-bot-token"
export CHANNEL_ID="@yourchannel"   # or numeric -100... id
npm start
```

The bot must be an admin (or member with post rights) of the channel.

### Example client call

```javascript
const form = new FormData();
form.append('images', file1);   // first image
form.append('images', file2);   // second image
if (years) form.append('years', years); // optional text -> sent as caption

const res = await fetch('http://localhost:3000/api/send-to-telegram', {
  method: 'POST',
  body: form, // do NOT set Content-Type manually
});
const data = await res.json();
```

### Example client call

```javascript
const form = new FormData();
form.append('name', 'Jessy');
form.append('file', fileInput.files[0]); // optional

const res = await fetch('http://localhost:3000/api/upload', {
  method: 'POST',
  body: form, // do NOT set Content-Type manually; the browser sets the boundary
});
const data = await res.json();
```
# express-app
