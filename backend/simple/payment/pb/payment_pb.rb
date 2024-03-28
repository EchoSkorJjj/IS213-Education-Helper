# frozen_string_literal: true
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: payment.proto

require 'google/protobuf'

require 'google/protobuf/timestamp_pb'


descriptor_data = "\n\rpayment.proto\x12\x07payment\x1a\x1fgoogle/protobuf/timestamp.proto\" \n\x0f\x43heckoutRequest\x12\r\n\x05\x65mail\x18\x01 \x01(\t\"\x1f\n\x10\x43heckoutResponse\x12\x0b\n\x03url\x18\x01 \x01(\t\"\x1d\n\x0eWebhookRequest\x12\x0b\n\x03raw\x18\x01 \x01(\t\"9\n\x0fWebhookResponse\x12\r\n\x05\x65mail\x18\x01 \x01(\t\x12\x17\n\x0fsubscription_id\x18\x02 \x01(\t\"4\n\x19\x43\x61ncelSubscriptionRequest\x12\x17\n\x0fsubscription_id\x18\x01 \x01(\t\"_\n\x1a\x43\x61ncelSubscriptionResponse\x12\x0f\n\x07success\x18\x01 \x01(\x08\x12\x30\n\x0c\x63\x61ncelled_at\x18\x03 \x01(\x0b\x32\x1a.google.protobuf.Timestamp\"3\n\x18\x43heckSubscriptionRequest\x12\x17\n\x0fsubscription_id\x18\x01 \x01(\t\"+\n\x19\x43heckSubscriptionResponse\x12\x0e\n\x06status\x18\x01 \x01(\t2\xc3\x02\n\x07Payment\x12?\n\x08\x43heckout\x12\x18.payment.CheckoutRequest\x1a\x19.payment.CheckoutResponse\x12<\n\x07Webhook\x12\x17.payment.WebhookRequest\x1a\x18.payment.WebhookResponse\x12]\n\x12\x43\x61ncelSubscription\x12\".payment.CancelSubscriptionRequest\x1a#.payment.CancelSubscriptionResponse\x12Z\n\x11\x43heckSubscription\x12!.payment.CheckSubscriptionRequest\x1a\".payment.CheckSubscriptionResponseb\x06proto3"

pool = Google::Protobuf::DescriptorPool.generated_pool

begin
  pool.add_serialized_file(descriptor_data)
rescue TypeError
  # Compatibility code: will be removed in the next major version.
  require 'google/protobuf/descriptor_pb'
  parsed = Google::Protobuf::FileDescriptorProto.decode(descriptor_data)
  parsed.clear_dependency
  serialized = parsed.class.encode(parsed)
  file = pool.add_serialized_file(serialized)
  warn "Warning: Protobuf detected an import path issue while loading generated file #{__FILE__}"
  imports = [
    ["google.protobuf.Timestamp", "google/protobuf/timestamp.proto"],
  ]
  imports.each do |type_name, expected_filename|
    import_file = pool.lookup(type_name).file_descriptor
    if import_file.name != expected_filename
      warn "- #{file.name} imports #{expected_filename}, but that import was loaded as #{import_file.name}"
    end
  end
  warn "Each proto file must use a consistent fully-qualified name."
  warn "This will become an error in the next major version."
end

module Payment
  CheckoutRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.CheckoutRequest").msgclass
  CheckoutResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.CheckoutResponse").msgclass
  WebhookRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.WebhookRequest").msgclass
  WebhookResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.WebhookResponse").msgclass
  CancelSubscriptionRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.CancelSubscriptionRequest").msgclass
  CancelSubscriptionResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.CancelSubscriptionResponse").msgclass
  CheckSubscriptionRequest = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.CheckSubscriptionRequest").msgclass
  CheckSubscriptionResponse = ::Google::Protobuf::DescriptorPool.generated_pool.lookup("payment.CheckSubscriptionResponse").msgclass
end
