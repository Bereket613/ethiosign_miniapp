import asyncio
import os
import pathlib

from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Message,
    WebAppInfo,
)

WELCOME = (
    "Welcome to EthioSign 🤝\n\n"
    "Accessible CTE learning for everyone."
)


def load_env() -> None:
    env_path = pathlib.Path(__file__).resolve().parents[1] / ".env"
    if not env_path.exists():
        return
    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


def main_keyboard(webapp_url: str) -> InlineKeyboardMarkup:
    web_app = WebAppInfo(url=webapp_url)
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Open EthioSign", web_app=web_app)]
        ]
    )


async def cmd_start(message: Message, keyboard: InlineKeyboardMarkup) -> None:
    await message.answer(WELCOME, reply_markup=keyboard)


async def any_message(message: Message, keyboard: InlineKeyboardMarkup) -> None:
    await message.answer(WELCOME, reply_markup=keyboard)


async def main() -> None:
    load_env()
    bot_token = os.getenv("BOT_TOKEN", "").strip()
    webapp_url = os.getenv("ETHIOSIGN_MINIAPP_URL", "").strip().rstrip("/")

    if not bot_token:
        raise SystemExit("BOT_TOKEN is not set. Add it to .env (get one from @BotFather).")
    if not webapp_url.startswith("https://"):
        raise SystemExit(
            "ETHIOSIGN_MINIAPP_URL must be a public HTTPS URL in .env (Telegram requires HTTPS)."
        )

    keyboard = main_keyboard(webapp_url)
    bot = Bot(bot_token)
    dp = Dispatcher()

    dp.message.register(lambda message: cmd_start(message, keyboard), CommandStart())
    dp.message.register(lambda message: any_message(message, keyboard))

    await bot.delete_webhook(drop_pending_updates=True)

    @dp.startup()
    async def on_startup(_) -> None:
        me = await bot.get_me()
        print(f"EthioSign demo bot running as @{me.username}")
        print(f"Mini App: {webapp_url}")

    await dp.start_polling(bot)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit) as exit_error:
        if isinstance(exit_error, SystemExit) and exit_error.code:
            raise
        print("\nBot stopped.")
