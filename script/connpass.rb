require 'rack'
require 'json'
require 'ncmb'
require 'nokogiri'
require 'httparty'

application_key = 'YOUR_APPLICATION_KEY'
client_key = 'YOUR_CLIENT_KEY'

NCMB.initialize application_key: application_key,  client_key: client_key

def call(env)
  req = Rack::Request.new(env)
  url = req.params['url']
  response = HTTParty.get url
  doc = Nokogiri::HTML response.body
  if doc.css('.owner_list li a[href="https://connpass.com/user/devcle/open/"]').size == 0
    return [
      404, {"Content-Type" => "application/json"}, [{error: 'DevCle is not found.'}.to_json]
    ]
  end
  name = doc.css('h2.event_title')[0].children.last.text.strip
  key = req.params['key']
  query = NCMB::DataStore.new 'Event'
  items = query.equalTo('url', url).get
  if items.size > 0
    return [
      200, {"Content-Type" => "application/json"}, [{objectId: items.first.objectId}.to_json]
    ]
  end
  obj = NCMB::Object.new 'Event'
  obj.set('classname', key)
  obj.set('key', key.downcase)
  obj.set('name', name)
  obj.set('url', url)
  results = obj.save
  [
    200, {"Content-Type" => "application/json"}, [{objectId: obj.objectId}.to_json]
  ]
end
