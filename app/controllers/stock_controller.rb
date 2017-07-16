# Action: stock_details: Sets @message: displayed in stock_details View footer
# Global variable: @@Is_Running: To see if service is running or requested to start or requested to stop from View
# Method: getStockDataFromApi: Gets data from Extertnal RestApi
# Action: getStockDetails: Calls getStockDataFromApi and return Json to View
# Errors gets logged in log_file.log

require 'httparty'
require 'json'
require 'logger'

class StockController < ApplicationController
  $LOG = Logger.new('log_file.log', 'monthly')
  @@Is_Running = 1

  def stock_details
    @message="Stock price report: By Banika Sirohi "
  end

  # output: stocks => array of Json data for each stock
  # variable symbols => array of symbol for each stock
  # variable url => constructs url for each stock by fetching config value from development.rb
  # external RestAPI gets called only if @@Is_Running set to 1
  def getStockDataFromApi
    if @@Is_Running.to_i == 0
      return [{"error": nil }].to_json
    end
    stocks = Array.new
    symbols = ["YHOO","AAPL","GOOG","MSFT","FB"]
    symbols.each do |symbol|
      url = "#{Rails.application.config.api_url}#{symbol}#{Rails.application.config.api_url_param}"
      begin
        response = HTTParty.get(url)
        begin
          parsed_response = JSON.parse(response.body)
          if parsed_response.has_key?("error")
            return ''.to_json()
          else
            keys =  parsed_response['Time Series (Daily)'].keys
            price_per_date = ""
            (0..4).each do |i|
              if price_per_date.blank?
                price_per_date ='{"time" : "'<< keys[i] << '", "price" : "'<< parsed_response["Time Series (Daily)"][keys[i]]["4. close"]<< '"}'
              else
                price_per_date = price_per_date + ',{"time" : "'<< keys[i] << '", "price" : "'<< parsed_response["Time Series (Daily)"][keys[i]]["4. close"]<< '"}'
              end
            end
              stockjson = JSON.parse('{"symbol": "'<<symbol<<'","pricehistory": ['<<price_per_date<<']}')
              stocks.append(stockjson)
          end
        rescue JSON::ParserError => e
          $LOG.error "Error in getting stock details from REST API: Method: callExternalAPI(): #{e}"
          puts "Error occured" << e
          return nil.to_json
        end
      rescue JSON::ParserError, TypeError => e
        $LOG.error "Error in getting stock details from REST API: Method: callExternalAPI(): #{e}"
        puts "Error occured" << e
        return nil.to_json
      end

    end
    return stocks
  end

  # output: json => @lastFivePricesWithStockName
  # Calls method: getStockDataFromApi for stock details
  def getStockDetails
    if(params.has_key?(:is_Running))
      @@Is_Running = params[:is_Running]
    end

      begin
        @lastFivePricesWithStockName = getStockDataFromApi

        respond_to do |format|
          format.json { render :json => @lastFivePricesWithStockName }
        end
      rescue JSON::ParserError, TypeError => e
        @lastFivePricesWithStockName = [{"error":"Oops! Error while fetching the web service. Please try again later."}].to_json
        @errormessage = "Error occured" << e
        $LOG.error "Error in getting stock details: Method: getStockDetails(): #{e}"
      ensure
        respond_to do |format|
          format.html
          format.js
          format.json { render :json => @lastFivePricesWithStockName }
        end
      end
  end

end
