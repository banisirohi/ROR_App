/*
* Method: getStockDetails() calls Controller:stock and Action:getStockDetails asynchronously using Ajax.
* Method: getStockDetails() called on load.
* Method: getStockDetails() also gets called in XXXX time interval.
****Default value of time interval set to 7000 which is 7 secs.
**** To change time interval in which report should get recent data can set to variable time_interval = XXXX;
* Method: onSuccess() called by getStockDetails() on completing ajax call successfully
* Method: onError() called by getStockDetails() on completing ajax call erroneously
* Method: onComplete() called by getStockDetails() on completing ajax call
* Method: groupTable() merges cells of html table having same value
* Method: draw(jsonData) renders bar chart called inside onSuccess().
*/

var time_interval = 7000;
var URL="/stock/getStockDetails";

$(getStockDetails);
setInterval("getStockDetails()",time_interval);

function groupTable($rows, startIndex, total){
    if (total === 0){
        return;
    }
    var i , currentIndex = startIndex, count=1, lst=[];
    var tds = $rows.find('td:eq('+ currentIndex +')');
    var ctrl = $(tds[0]);
    lst.push($rows[0]);
    for (i=1;i<=tds.length;i++){
        if (ctrl.text() ==  $(tds[i]).text()){
            count++;
            $(tds[i]).addClass('deleted');
            lst.push($rows[i]);
        }
        else{
            if (count>1){
                ctrl.attr('rowspan',count);
                groupTable($(lst),startIndex+1,total-1)
            }
            count=1;
            lst = [];
            ctrl=$(tds[i]);
            lst.push($rows[i]);
        }
    }
}

function onSuccess(data)
{
    console.log('in success');
    if($.isEmptyObject(data) || (data[0].hasOwnProperty('error'))){
        onError();
    }
    else
    {
        $('#btnStop').show();
        $('#btnStart').hide();
        $('.hideOnError').show();
        $('.showOnError').hide();
        $('.serviceStatus').html("Service running...")

        var tablerows = [];
        var chartrows=[];
        $.each(data, function(i, stock) {
            chartrows.push("{\"symbol\":\""+ stock.symbol +"\",\"price\":\""+stock.pricehistory[0].price+"\"}");
            $.each(stock.pricehistory, function(i, pricehistory) {
                tablerows.push("<tr><td>" + stock.symbol + "</td>");
                tablerows.push("<td>" + pricehistory.time + "</td>");
                tablerows.push("<td>" + pricehistory.price + "</td></tr>");
            });
        });
        $('.hide').show();
        $('#stockContent').html(tablerows.join(""));
        groupTable($('#tblStockDetails tr:has(td)'),0,1);
        $('#tblStockDetails .deleted').remove();
        draw(JSON.parse("["+chartrows.join(",") +"]"));
    }
}

function onError()
{
    console.log('in err');
    $('.hideOnError').hide();
    $('.showOnError').show();
    $('#btnStop').hide();
    $('#btnStart').show();
    $('#chart').empty();
    //$('.showOnError').html("Oops! Some error occured. Pease try again later.")
    $('.serviceStatus').html("Service stopped...");
    $('#dataStatus').html("No data to display");
}

function onComplete()
{
    console.log('in conplete');
}

function getStockDetails(){
    $.ajax({
        url : URL,
        error:function(){
            onError();
        },
        success: function(data){
            onSuccess(data);
        },
        always: function(){
            onComplete();
        }
    });
}
