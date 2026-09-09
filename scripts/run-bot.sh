#!/usr/bin/env bash
# Auto-restart wrapper for the EthioSign demo bot.
# Keeps the bot alive even if the process crashes.
cd /workspace/ethiosign_miniapp
while true; do
  PYTHONUNBUFFERED=1 uv run --with aiogram python bot/bot.py >> /tmp/opencode/bot.log 2>&1
  echo "$(date) bot exited, restarting in 5s" >> /tmp/opencode/bot.log
  sleep 5
done
