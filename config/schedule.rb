# scheduler to generate text report in every 1 hour
# log details in log/cron_log.log
# log error logs in log/cron_error_log.log
# set : environment to "production" for production

set :environment, 'development'
set :output, {:error => "log/cron_error_log.log", :standard => "log/cron_log.log"}

# calls Model:Stock_Report_Scheduler => Method:generateStockReport
every :hour do
  runner "Stock_Report_Scheduler.generateStockReport"
end