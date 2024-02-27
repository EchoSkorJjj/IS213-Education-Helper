require 'bundler/setup'
Bundler.require(:default)

require 'sinatra'
require 'stripe'
require 'json'
require 'dotenv'
require 'grpc' # Add this line
require './stripe_webhook_pb'

Dotenv.load

Stripe.api_key = ENV['STRIPE_SECRET_KEY']
stripe_webhook_secret = ENV['STRIPE_WEBHOOK_SECRET']

# Define a protobuf service for the Stripe webhook
class StripeWebhookService < StripeWebhook::Service
  def create_checkout_session(_empty, _call)
    session = Stripe::Checkout::Session.create(
      payment_method_types: ['card'],
      line_items: [{
        price: ENV['STRIPE_PRICE_ID'], 
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    )

    # Return the session's URL to the client
    CheckoutSession.new(url: session.url)
  end

  def send_event(stripe_event, _call)
    # Handle the event
    case stripe_event.type
    when 'checkout.session.completed'
      handle_checkout_session(stripe_event.data)
    # ... handle other event types
    else
      puts "Unhandled event type: #{stripe_event.type}"
    end

    # Return the event back to the client
    stripe_event
  end

  def handle_checkout_session(session)
    # Here you might want to look up the session in your database and mark it as paid
    # Or you might want to create a new order in your database
    puts "Checkout session completed! ID: #{session.id}"
  end
end

# Start a gRPC server
s = GRPC::RpcServer.new
s.add_http2_port('0.0.0.0:50051', :this_port_is_insecure)
s.handle(StripeWebhookService)
s.run_till_terminated
