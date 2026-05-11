class CacheService:
    def __init__(self):
        self._cache: dict = {}

    def get(self, key: str):
        return self._cache.get(key)

    def set(self, key: str, value, ttl: int = 3600) -> None:
        self._cache[key] = value

    def delete(self, key: str) -> None:
        self._cache.pop(key, None)


cache = CacheService()
