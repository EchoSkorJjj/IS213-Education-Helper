require 'bundler/setup'
Bundler.require(:default)

require 'sinatra'
require 'stripe'
require 'json'
require 'dotenv'
require 'sinatra/cross_origin'
require 'sinatra/json'
require 'grpc'
require 'backend/kong-gateway/protos/make_payment_pb'

Dotenv.load

Stripe.api_key = ENV['STRIPE_SECRET_KEY']
stripe_webhook_secret = ENV['STRIPE_WEBHOOK_SECRET']

configure do
  enable :cross_origin
  set :logging, true
  set :bind, '0.0.0.0'
end

before do
  response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3001'
  response.headers['Access-Control-Allow-Credentials'] = 'true'
end

options "*" do
  response.headers["Allow"] = "GET, PUT, POST, DELETE, OPTIONS"
  response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type, Accept, X-User-Email, X-Auth-Token"
  response.headers["Access-Control-Allow-Origin"] = "*"
  response.headers["Access-Control-Allow-Credentials"] = 'true'
  200
end

get '/health' do
  status 200
end

class MakePaymentServiceServer < MakePaymentService::Service
    def checkout(request, _)
      # Extract customer email from the request
      customer_email = request.email
  
      # Create a new Stripe Checkout Session
      session = Stripe::Checkout::Session.create(
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
  
      # Return the session URL
      MakePaymentService::CheckoutResponse.new(url: session.url)
    end
  
    def successful_payment(request, _)
      # Extract customer ID from the request
      customer_id = request.customer_id
  
      # Retrieve the customer from Stripe
      customer = Stripe::Customer.retrieve(customer_id)
  
      # Calculate the subscription end date (1 month from now)
      subscribed_until = Time.now + 1.month
  
      # Return the subscription end date
      MakePaymentService::SuccessfulPaymentResponse.new(subscribed_until: Google::Protobuf::Timestamp.new(seconds: subscribed_until.to_i))
    end
  end

server = GRPC::RpcServer.new
server.add_http2_port('0.0.0.0:50052', :this_port_is_insecure)
server.handle(MakePaymentServiceServer)
server.run_till_terminated
