# Method: generateStockReport() called by runner in schedule.rb
# Method: generateStockReport() calls StockController => getStockDataFromApi for stock details
# Errors logged in log_file.log

class Stock_Report_Scheduler

  # writes stock details in text file
  # Outputs: File with filename "StockReport" appended with current time

  def self.generateStockReport()
      begin
        objStock = StockController.new
        reportData = objStock.getStockDataFromApi
        reportFilename = "StockReport"<<Time.now.to_s<<".txt"
        out_file = File.new(reportFilename, "w")
        reportData.each do |key, value|
          out_file.puts("Symbol: "<<key["symbol"])
          pricehistory = key["pricehistory"]
          pricehistory.each do |key,value|
            out_file.puts("Date: "<<key["time"]<<" Price: "<<key["price"])
          end
        end
        out_file.close
      rescue => e
        $LOG.error "Error in generating report: Method : createStockReport() : #{e}"
      end
    end

end