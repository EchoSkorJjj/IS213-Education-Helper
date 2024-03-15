require_relative '../../pb/payment_pb'
require_relative '../../pb/payment_services_pb'
require_relative '../config/stripe'

require 'json'

class PaymentServicer < Payment::Payment::Service
    def checkout(checkout_request, _call)
        customer_email = checkout_request.email

        session = configured_stripe::Checkout::Session.create(
          payment_method_types: ['card'],
          line_items: [{
            price: ENV['STRIPE_PRICE_ID'], 
            quantity: 1,
          }],
          mode: 'subscription',
          success_url: 'http://localhost:3001/subscribe',
          cancel_url: 'http://localhost:3001/subscribe',
          customer_email: customer_email,
        )

        Payment::CheckoutResponse.new(url: session.url)
    end

    def check_subscription(check_request, _call)
      subscription_id = check_request.subscription_id
  
      subscription = configured_stripe::Subscription.retrieve(subscription_id)
      status = subscription.status
  
      Payment::CheckSubscriptionResponse.new(status: status)
    rescue StandardError => e
      Payment::CheckSubscriptionResponse.new(status: 'unknown', error_message: e.message)
    end


    def cancel_subscription(cancel_request, _call)
        subscription_id = cancel_request.subscription_id
        
        subscription = configured_stripe::Subscription.retrieve(subscription_id)
        subscription.delete
        Payment::CancelSubscriptionResponse.new(success: true)
      
    rescue Stripe::InvalidRequestError => e
        Payment::CancelSubscriptionResponse.new(success: false, error_message: "Stripe error: #{e.message}")
    rescue StandardError => e
        Payment::CancelSubscriptionResponse.new(success: false, error_message: e.message)
    end
    
    def webhook(webhook_request, _call)
        payload = webhook_request.raw
        stripe_signature = _call.metadata["stripe-signature"]
        event = nil

        begin
          event = configured_stripe::Webhook.construct_event(
              payload, stripe_signature, ENV['STRIPE_WEBHOOK_SECRET']
          )
        rescue JSON::ParserError => e
          raise GRPC::BadStatus.new_status_exception(GRPC::Core::StatusCodes::INVALID_ARGUMENT, e.message)
        rescue configured_stripe::SignatureVerificationError => e
          raise GRPC::BadStatus.new_status_exception(GRPC::Core::StatusCodes::INVALID_ARGUMENT, e.message)
        end

        if event.type != 'checkout.session.completed'
          raise GRPC::BadStatus.new_status_exception(GRPC::Core::StatusCodes::INVALID_ARGUMENT, "Received unsupported event of type: #{event.type}")
        end

        session = event.data.object
        customer_id = session.customer
        susbcription_id = session.subscription
      
        customer = configured_stripe::Customer.retrieve(customer_id)
        customer_email = customer.email
      
        Payment::WebhookResponse.new(email: customer_email, subscription_id: subscription_id)
    end
end