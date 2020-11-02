require 'rack'
require 'json'
require 'httparty'

ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN'

def call(env)
  req = Rack::Request.new(env)
  url = "https://api-ssl.bitly.com/v3/shorten?access_token=#{ACCESS_TOKEN}&longUrl=#{req.params['url']}"
  response = HTTParty.get url
  [
    200, {"Content-Type" => "application/json"}, [response.body]
  ]
end
