import os
import grpc
import logging
import src.utils.grpc_utils as grpc_utils


class ValidationInterceptor(grpc.ServerInterceptor):
    def __init__(self):
        def abort(ignored_request, context):
            logging.error('Aborting request, missing kong-request-id')
            context.abort(grpc.StatusCode.PERMISSION_DENIED, 'Missing kong-request-id')
        
        self._abort = grpc.unary_unary_rpc_method_handler(abort)

    def intercept_service(self, continuation, handler_call_details):
        metadata = dict(handler_call_details.invocation_metadata)
        environment = os.getenv('ENVIRONMENT_MODE')
        method = handler_call_details.method

        # Checks for 3 things, which are whether:
        # 1. kong-request-id is missing from metadata
        # 2. environment is not development
        # 3. service hit is a healthcheck endpoint
        # If all 3 conditions are met, then the request is aborted
        if grpc_utils.kong_request_id_critically_missing(metadata, environment, method):
            return self._abort

        return continuation(handler_call_details)
