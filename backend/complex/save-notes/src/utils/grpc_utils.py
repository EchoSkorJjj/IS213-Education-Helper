import base64

def get_grpc_client_address(service_name, service_port):
    return f"{service_name}:{service_port}"

def kong_request_id_critically_missing(metadata, environment, method):
    return 'kong-request-id' not in metadata and environment != 'development' and method != '/grpc.health.v1.Health/Check'

