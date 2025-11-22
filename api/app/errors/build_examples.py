def examples(error_messages: dict) -> dict:
    return {
        code: {
            "summary": message.split(".")[0],
            "value": {"error": code, "detail": message},
        }
        for code, message in error_messages.items()
    }
