from typing import Type, List
import logging
import os
import json
import uuid

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
        if self._host is None:
            raise ValueError('Host not set')
        if self._port is None:
            raise ValueError('Port not set')

        client = redis.Redis(
            host=self._host,
            port=self._port,
            username=os.getenv("CACHE_USERNAME"),
            password=os.getenv("CACHE_PASSWORD"),
        )
        logging.debug(f"Cache connected at {self._host}:{self._port}")

        self._client = client
    
    def get_all_by_key(self, key: str) -> List[object]:
        if self._client is None:
            raise ValueError('Not connected')

        all_objects = self._client.lrange(key, 0, -1)
        return [json.loads(obj) for obj in all_objects]
    
    def create_object(self, key: str, value: object) -> object:
        if self._client is None:
            raise ValueError('Not connected')

        try:
            temp_id = str(uuid.uuid4())
            id_tagged_value = {"id": temp_id, **value}
            dumped_value = json.dumps(id_tagged_value)

            self._client.rpush(key, dumped_value)
            return id_tagged_value
        except Exception as e:
            raise e

    def get_object_by_id(self, key: str, temp_id: str) -> object | None:
        if self._client is None:
            raise ValueError('Not connected')

        all_objects = self._client.lrange(key, 0, -1)
        for obj in all_objects:
            obj_dict = json.loads(obj)
            if obj_dict["id"] == temp_id:
                return obj_dict

        return None

    def update_object_by_id(self, key: str, temp_id: str, new_value: object) -> object:
        if self._client is None:
            raise ValueError('Not connected')

        all_objects = self._client.lrange(key, 0, -1)
        for i, obj in enumerate(all_objects):
            obj_dict = json.loads(obj)
            if obj_dict["id"] == temp_id:
                for field in new_value:
                    obj_dict[field] = new_value[field]

                self._client.lset(key, i, json.dumps(obj_dict))
                return obj_dict
        
        raise ValueError(f"Object with id {temp_id} not found in {key}")

    def delete_object_by_id(self, key: str, temp_id: str) -> object:
        if self._client is None:
            raise ValueError('Not connected')

        all_objects = self._client.lrange(key, 0, -1)
        for obj in all_objects:
            obj_dict = json.loads(obj)
            if obj_dict["id"] == temp_id:
                self._client.lrem(key, 1, obj)
                return obj_dict
        
        raise ValueError(f"Object with id {temp_id} not found in {key}")
    
    def delete_all_by_key(self, key: str) -> None:
        if self._client is None:
            raise ValueError('Not connected')

        self._client.delete(key)
