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

get '/checkout' do
    session = Stripe::Checkout::Session.create(
      payment_method_types: ['card'],
      line_items: [{
        price: ENV['STRIPE_PRICE_ID'], 
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: 'http://localhost:3001/subscribe',
      cancel_url: 'http://localhost:3001/subscribe',
    )
  
    json url:session.url
  end

  post '/webhook' do
    payload = request.body.read
    sig_header = request.env['HTTP_STRIPE_SIGNATURE']
  
    event = nil
  
    begin
      event = Stripe::Webhook.construct_event(
        payload, sig_header, stripe_webhook_secret
      )
    rescue JSON::ParserError => e
      # Invalid payload
      status 400
      return 'Bad request'
    rescue Stripe::SignatureVerificationError => e
      # Invalid signature
      status 400
      return 'Bad request'
    end
  
    # Handle the event
    case event.type
    when 'checkout.session.completed'
      session = event.data.object
      handle_checkout_session(session)
    # ... handle other event types
    else
      puts "Unhandled event type: #{event.type}"
    end
  
    status 200
  end
  
  def handle_checkout_session(session)
    # Here you might want to look up the session in your database and mark it as paid
    # Or you might want to create a new order in your database
    puts "Checkout session completed! ID: #{session.id}"
  end