from typing import Type
import logging
import os

import redis

class Cache:
    _client: 'redis.Redis' = None

    def __new__(cls: Type['Cache']) -> 'Cache':
        if not hasattr(cls, 'instance'):
            logging.debug("No instance of 'Cache' found, creating a new one")
            cls.instance = super(Cache, cls).__new__(cls)
        return cls.instance
    
    def set_host(self, host: str) -> None:
        self._host = host
    
    def set_port(self, port: int) -> None:
        self._port = port
    
    def connect(self) -> None:
        if not self._host:
            raise ValueError('Host not set')
        if not self._port:
            raise ValueError('Port not set')

        client = redis.Redis(
            host=self._host,
            port=self._port,
            username=os.getenv("CACHE_USERNAME"),
            password=os.getenv("CACHE_PASSWORD"),
        )
        logging.debug(f"Cache connected at {self._host}:{self._port}")

        self._client = client
    
    def set(self, key: str, value: str) -> bool | None:
        if not self._client:
            raise ValueError('Not connected')

        return self._client.set(key, value)
    
    def get(self, key: str) -> str | None:
        if not self._client:
            raise ValueError('Not connected')

        return self._client.get(key)
    
    def hset(self, key: str, mapping: dict) -> int: # Docs say boolean, but function hint says int...
        if not self._client:
            raise ValueError('Not connected')

        return self._client.hset(key, mapping=mapping)
    
    def hget(self, key: str) -> dict | None:
        if not self._client:
            raise ValueError('Not connected')

        return self._client.hget(key)