// Generated by the gRPC C++ plugin.
// If you make any local change, they will be lost.
// source: subscriptions.proto

#include "subscriptions.pb.h"
#include "subscriptions.grpc.pb.h"

#include <functional>
#include <grpcpp/support/async_stream.h>
#include <grpcpp/support/async_unary_call.h>
#include <grpcpp/impl/channel_interface.h>
#include <grpcpp/impl/client_unary_call.h>
#include <grpcpp/support/client_callback.h>
#include <grpcpp/support/message_allocator.h>
#include <grpcpp/support/method_handler.h>
#include <grpcpp/impl/rpc_service_method.h>
#include <grpcpp/support/server_callback.h>
#include <grpcpp/impl/server_callback_handlers.h>
#include <grpcpp/server_context.h>
#include <grpcpp/impl/service_type.h>
#include <grpcpp/support/sync_stream.h>
namespace subscription_pb {

static const char* Subscription_method_names[] = {
  "/subscription_pb.Subscription/CreateSubscription",
  "/subscription_pb.Subscription/GetSubscription",
  "/subscription_pb.Subscription/DeleteSubscription",
  "/subscription_pb.Subscription/CheckHealth",
};

std::unique_ptr< Subscription::Stub> Subscription::NewStub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options) {
  (void)options;
  std::unique_ptr< Subscription::Stub> stub(new Subscription::Stub(channel, options));
  return stub;
}

Subscription::Stub::Stub(const std::shared_ptr< ::grpc::ChannelInterface>& channel, const ::grpc::StubOptions& options)
  : channel_(channel), rpcmethod_CreateSubscription_(Subscription_method_names[0], options.suffix_for_stats(),::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  , rpcmethod_GetSubscription_(Subscription_method_names[1], options.suffix_for_stats(),::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  , rpcmethod_DeleteSubscription_(Subscription_method_names[2], options.suffix_for_stats(),::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  , rpcmethod_CheckHealth_(Subscription_method_names[3], options.suffix_for_stats(),::grpc::internal::RpcMethod::NORMAL_RPC, channel)
  {}

::grpc::Status Subscription::Stub::CreateSubscription(::grpc::ClientContext* context, const ::subscription_pb::CreateSubscriptionRequest& request, ::subscription_pb::ServiceResponseWrapper* response) {
  return ::grpc::internal::BlockingUnaryCall< ::subscription_pb::CreateSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), rpcmethod_CreateSubscription_, context, request, response);
}

void Subscription::Stub::async::CreateSubscription(::grpc::ClientContext* context, const ::subscription_pb::CreateSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response, std::function<void(::grpc::Status)> f) {
  ::grpc::internal::CallbackUnaryCall< ::subscription_pb::CreateSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_CreateSubscription_, context, request, response, std::move(f));
}

void Subscription::Stub::async::CreateSubscription(::grpc::ClientContext* context, const ::subscription_pb::CreateSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response, ::grpc::ClientUnaryReactor* reactor) {
  ::grpc::internal::ClientCallbackUnaryFactory::Create< ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_CreateSubscription_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::ServiceResponseWrapper>* Subscription::Stub::PrepareAsyncCreateSubscriptionRaw(::grpc::ClientContext* context, const ::subscription_pb::CreateSubscriptionRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderHelper::Create< ::subscription_pb::ServiceResponseWrapper, ::subscription_pb::CreateSubscriptionRequest, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), cq, rpcmethod_CreateSubscription_, context, request);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::ServiceResponseWrapper>* Subscription::Stub::AsyncCreateSubscriptionRaw(::grpc::ClientContext* context, const ::subscription_pb::CreateSubscriptionRequest& request, ::grpc::CompletionQueue* cq) {
  auto* result =
    this->PrepareAsyncCreateSubscriptionRaw(context, request, cq);
  result->StartCall();
  return result;
}

::grpc::Status Subscription::Stub::GetSubscription(::grpc::ClientContext* context, const ::subscription_pb::GetSubscriptionRequest& request, ::subscription_pb::ServiceResponseWrapper* response) {
  return ::grpc::internal::BlockingUnaryCall< ::subscription_pb::GetSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), rpcmethod_GetSubscription_, context, request, response);
}

void Subscription::Stub::async::GetSubscription(::grpc::ClientContext* context, const ::subscription_pb::GetSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response, std::function<void(::grpc::Status)> f) {
  ::grpc::internal::CallbackUnaryCall< ::subscription_pb::GetSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_GetSubscription_, context, request, response, std::move(f));
}

void Subscription::Stub::async::GetSubscription(::grpc::ClientContext* context, const ::subscription_pb::GetSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response, ::grpc::ClientUnaryReactor* reactor) {
  ::grpc::internal::ClientCallbackUnaryFactory::Create< ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_GetSubscription_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::ServiceResponseWrapper>* Subscription::Stub::PrepareAsyncGetSubscriptionRaw(::grpc::ClientContext* context, const ::subscription_pb::GetSubscriptionRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderHelper::Create< ::subscription_pb::ServiceResponseWrapper, ::subscription_pb::GetSubscriptionRequest, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), cq, rpcmethod_GetSubscription_, context, request);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::ServiceResponseWrapper>* Subscription::Stub::AsyncGetSubscriptionRaw(::grpc::ClientContext* context, const ::subscription_pb::GetSubscriptionRequest& request, ::grpc::CompletionQueue* cq) {
  auto* result =
    this->PrepareAsyncGetSubscriptionRaw(context, request, cq);
  result->StartCall();
  return result;
}

::grpc::Status Subscription::Stub::DeleteSubscription(::grpc::ClientContext* context, const ::subscription_pb::DeleteSubscriptionRequest& request, ::subscription_pb::ServiceResponseWrapper* response) {
  return ::grpc::internal::BlockingUnaryCall< ::subscription_pb::DeleteSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), rpcmethod_DeleteSubscription_, context, request, response);
}

void Subscription::Stub::async::DeleteSubscription(::grpc::ClientContext* context, const ::subscription_pb::DeleteSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response, std::function<void(::grpc::Status)> f) {
  ::grpc::internal::CallbackUnaryCall< ::subscription_pb::DeleteSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_DeleteSubscription_, context, request, response, std::move(f));
}

void Subscription::Stub::async::DeleteSubscription(::grpc::ClientContext* context, const ::subscription_pb::DeleteSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response, ::grpc::ClientUnaryReactor* reactor) {
  ::grpc::internal::ClientCallbackUnaryFactory::Create< ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_DeleteSubscription_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::ServiceResponseWrapper>* Subscription::Stub::PrepareAsyncDeleteSubscriptionRaw(::grpc::ClientContext* context, const ::subscription_pb::DeleteSubscriptionRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderHelper::Create< ::subscription_pb::ServiceResponseWrapper, ::subscription_pb::DeleteSubscriptionRequest, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), cq, rpcmethod_DeleteSubscription_, context, request);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::ServiceResponseWrapper>* Subscription::Stub::AsyncDeleteSubscriptionRaw(::grpc::ClientContext* context, const ::subscription_pb::DeleteSubscriptionRequest& request, ::grpc::CompletionQueue* cq) {
  auto* result =
    this->PrepareAsyncDeleteSubscriptionRaw(context, request, cq);
  result->StartCall();
  return result;
}

::grpc::Status Subscription::Stub::CheckHealth(::grpc::ClientContext* context, const ::subscription_pb::HealthCheckRequest& request, ::subscription_pb::HealthCheckResponse* response) {
  return ::grpc::internal::BlockingUnaryCall< ::subscription_pb::HealthCheckRequest, ::subscription_pb::HealthCheckResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), rpcmethod_CheckHealth_, context, request, response);
}

void Subscription::Stub::async::CheckHealth(::grpc::ClientContext* context, const ::subscription_pb::HealthCheckRequest* request, ::subscription_pb::HealthCheckResponse* response, std::function<void(::grpc::Status)> f) {
  ::grpc::internal::CallbackUnaryCall< ::subscription_pb::HealthCheckRequest, ::subscription_pb::HealthCheckResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_CheckHealth_, context, request, response, std::move(f));
}

void Subscription::Stub::async::CheckHealth(::grpc::ClientContext* context, const ::subscription_pb::HealthCheckRequest* request, ::subscription_pb::HealthCheckResponse* response, ::grpc::ClientUnaryReactor* reactor) {
  ::grpc::internal::ClientCallbackUnaryFactory::Create< ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(stub_->channel_.get(), stub_->rpcmethod_CheckHealth_, context, request, response, reactor);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::HealthCheckResponse>* Subscription::Stub::PrepareAsyncCheckHealthRaw(::grpc::ClientContext* context, const ::subscription_pb::HealthCheckRequest& request, ::grpc::CompletionQueue* cq) {
  return ::grpc::internal::ClientAsyncResponseReaderHelper::Create< ::subscription_pb::HealthCheckResponse, ::subscription_pb::HealthCheckRequest, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(channel_.get(), cq, rpcmethod_CheckHealth_, context, request);
}

::grpc::ClientAsyncResponseReader< ::subscription_pb::HealthCheckResponse>* Subscription::Stub::AsyncCheckHealthRaw(::grpc::ClientContext* context, const ::subscription_pb::HealthCheckRequest& request, ::grpc::CompletionQueue* cq) {
  auto* result =
    this->PrepareAsyncCheckHealthRaw(context, request, cq);
  result->StartCall();
  return result;
}

Subscription::Service::Service() {
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      Subscription_method_names[0],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< Subscription::Service, ::subscription_pb::CreateSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(
          [](Subscription::Service* service,
             ::grpc::ServerContext* ctx,
             const ::subscription_pb::CreateSubscriptionRequest* req,
             ::subscription_pb::ServiceResponseWrapper* resp) {
               return service->CreateSubscription(ctx, req, resp);
             }, this)));
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      Subscription_method_names[1],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< Subscription::Service, ::subscription_pb::GetSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(
          [](Subscription::Service* service,
             ::grpc::ServerContext* ctx,
             const ::subscription_pb::GetSubscriptionRequest* req,
             ::subscription_pb::ServiceResponseWrapper* resp) {
               return service->GetSubscription(ctx, req, resp);
             }, this)));
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      Subscription_method_names[2],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< Subscription::Service, ::subscription_pb::DeleteSubscriptionRequest, ::subscription_pb::ServiceResponseWrapper, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(
          [](Subscription::Service* service,
             ::grpc::ServerContext* ctx,
             const ::subscription_pb::DeleteSubscriptionRequest* req,
             ::subscription_pb::ServiceResponseWrapper* resp) {
               return service->DeleteSubscription(ctx, req, resp);
             }, this)));
  AddMethod(new ::grpc::internal::RpcServiceMethod(
      Subscription_method_names[3],
      ::grpc::internal::RpcMethod::NORMAL_RPC,
      new ::grpc::internal::RpcMethodHandler< Subscription::Service, ::subscription_pb::HealthCheckRequest, ::subscription_pb::HealthCheckResponse, ::grpc::protobuf::MessageLite, ::grpc::protobuf::MessageLite>(
          [](Subscription::Service* service,
             ::grpc::ServerContext* ctx,
             const ::subscription_pb::HealthCheckRequest* req,
             ::subscription_pb::HealthCheckResponse* resp) {
               return service->CheckHealth(ctx, req, resp);
             }, this)));
}

Subscription::Service::~Service() {
}

::grpc::Status Subscription::Service::CreateSubscription(::grpc::ServerContext* context, const ::subscription_pb::CreateSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}

::grpc::Status Subscription::Service::GetSubscription(::grpc::ServerContext* context, const ::subscription_pb::GetSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}

::grpc::Status Subscription::Service::DeleteSubscription(::grpc::ServerContext* context, const ::subscription_pb::DeleteSubscriptionRequest* request, ::subscription_pb::ServiceResponseWrapper* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}

::grpc::Status Subscription::Service::CheckHealth(::grpc::ServerContext* context, const ::subscription_pb::HealthCheckRequest* request, ::subscription_pb::HealthCheckResponse* response) {
  (void) context;
  (void) request;
  (void) response;
  return ::grpc::Status(::grpc::StatusCode::UNIMPLEMENTED, "");
}


}  // namespace subscription_pb

