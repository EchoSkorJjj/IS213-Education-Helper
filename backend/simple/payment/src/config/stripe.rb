require 'stripe'

def configured_stripe
    Stripe.api_key = ENV['STRIPE_SECRET_KEY']
    Stripe
end