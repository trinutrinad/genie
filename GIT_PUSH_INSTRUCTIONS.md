# Git Push Instructions

Your code has been committed locally! Now you need to authenticate with GitHub to push.

## Option 1: Use GitHub Personal Access Token (Recommended)

1. **Create a Personal Access Token:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"
   - Name it: "Genie Push"
   - Select scopes: ✅ `repo` (full control of private repositories)
   - Click "Generate token"
   - **Copy the token immediately** (you won't see it again!)

2. **Push using the token:**
   ```bash
   git push -u origin main
   ```
   - When prompted for username: Enter `trinutrinad`
   - When prompted for password: **Paste your token** (not your GitHub password)

## Option 2: Use SSH (More Secure)

1. **Check if you have SSH key:**
   ```bash
   ls ~/.ssh/id_rsa.pub
   ```

2. **If no SSH key, generate one:**
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```
   - Press Enter to accept default location
   - Press Enter twice for no passphrase (or set one)

3. **Add SSH key to GitHub:**
   - Copy your public key:
     ```bash
     cat ~/.ssh/id_ed25519.pub
     ```
   - Go to: https://github.com/settings/keys
   - Click "New SSH key"
   - Paste the key and save

4. **Change remote to SSH:**
   ```bash
   git remote set-url origin git@github.com:trinutrinad/genie.git
   git push -u origin main
   ```

## Option 3: Use GitHub CLI

1. **Install GitHub CLI** (if not installed):
   - Download from: https://cli.github.com/

2. **Authenticate:**
   ```bash
   gh auth login
   ```
   - Follow the prompts

3. **Push:**
   ```bash
   git push -u origin main
   ```

## Quick Fix: Update Remote URL with Token

If you have your token ready, you can also do:

```bash
git remote set-url origin https://YOUR_TOKEN@github.com/trinutrinad/genie.git
git push -u origin main
```

Replace `YOUR_TOKEN` with your actual personal access token.

---

## Current Status

✅ Git repository initialized
✅ All files committed locally (60 files, 16,074 lines)
✅ Remote repository configured
⏳ Waiting for authentication to push

Once authenticated, your code will be pushed to: https://github.com/trinutrinad/genie.git

