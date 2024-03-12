require 'bundler/setup'
Bundler.require(:default)

require 'sinatra'
require 'stripe'
require 'json'
require 'dotenv'
require 'sinatra/cross_origin'
require 'sinatra/json'

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

get '/checkout' do
  customer_email = params['email'] 
  #might need to change depending on how the customer_email is retrieved
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

  { url: session.url }.to_json
end

post '/webhook' do
  payload = request.body.read
  sig_header = request.env['HTTP_STRIPE_SIGNATURE']
  event = nil

  begin
    event = Stripe::Webhook.construct_event(
        payload, sig_header, ENV['STRIPE_WEBHOOK_SECRET']
    )
  rescue JSON::ParserError => e
      # Invalid payload
      logger.info e
      status 400
      return
  rescue Stripe::SignatureVerificationError => e
      # Invalid signature
      logger.info e
      status 400
      return
  end

  # Handle the checkout.session.completed event
  if event.type != 'checkout.session.completed'
    logger.info "Unhandled event type: #{event.type}"
    status 400
    return
  end

  session = event.data.object
  puts session
  customer_id = session.customer

  # Now you can use the customer_id
  # For example, print it:
  customer = Stripe::Customer.retrieve(customer_id)
  puts customer

  # Extract the customer's email
  customer_email = customer.email

  # Return customer's email
  { email: customer_email }.to_json
end