import logging
import time

import grpc

class LoggingInterceptor(grpc.ServerInterceptor):
    def intercept_service(self, continuation, handler_call_details):
        start_time = time.time()
        method = handler_call_details.method
        response = continuation(handler_call_details)
        elapsed_time = time.time() - start_time 
        logging.info(f"{method} - Took {elapsed_time} seconds")     

        return response