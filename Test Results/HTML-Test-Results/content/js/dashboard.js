/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.80858676207514, "KoPercent": 2.191413237924866};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8004926108374384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Visit Transfer Funds Page-0"], "isController": false}, {"data": [1.0, 500, 1500, "Visit Transfer Funds Page-1"], "isController": false}, {"data": [1.0, 500, 1500, "Redirection to home page"], "isController": false}, {"data": [0.905, 500, 1500, "Visit Login Page"], "isController": false}, {"data": [0.9275, 500, 1500, "Redirected to landing page"], "isController": false}, {"data": [1.0, 500, 1500, "Initiate Funds Transfer-0"], "isController": false}, {"data": [1.0, 500, 1500, "Click on Logout-1"], "isController": false}, {"data": [0.98, 500, 1500, "Click on Logout-0"], "isController": false}, {"data": [0.54, 500, 1500, "Click on Logout"], "isController": false}, {"data": [0.92, 500, 1500, "Visit Transfer Funds Page"], "isController": false}, {"data": [1.0, 500, 1500, "Redirected to landing page-1"], "isController": false}, {"data": [0.0, 500, 1500, "Transaction Controller"], "isController": true}, {"data": [0.4925, 500, 1500, "Login Process"], "isController": false}, {"data": [0.9685863874345549, 500, 1500, "Login Process-1"], "isController": false}, {"data": [0.8825, 500, 1500, "Initiate Funds Transfer"], "isController": false}, {"data": [1.0, 500, 1500, "Initiate Funds Transfer-1"], "isController": false}, {"data": [0.9738219895287958, 500, 1500, "Login Process-0"], "isController": false}, {"data": [0.5, 500, 1500, "Redirected to landing page-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2236, 49, 2.191413237924866, 343.8300536672631, 239, 1414, 263.0, 524.0, 549.0, 1116.63, 97.62913155481814, 709.4016835267214, 193.2824541271886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Visit Transfer Funds Page-0", 9, 0, 0.0, 258.55555555555554, 253, 270, 257.0, 270.0, 270.0, 270.0, 27.027027027027028, 3.351984797297297, 31.376102665165163], "isController": false}, {"data": ["Visit Transfer Funds Page-1", 9, 0, 0.0, 295.0, 270, 318, 303.0, 318.0, 318.0, 318.0, 25.936599423631126, 216.1552143371758, 29.907578350144096], "isController": false}, {"data": ["Redirection to home page", 200, 0, 0.0, 258.31, 242, 278, 258.0, 267.0, 269.0, 276.99, 9.809691975671964, 90.0690663625662, 16.620722054639984], "isController": false}, {"data": ["Visit Login Page", 200, 0, 0.0, 310.80999999999983, 242, 645, 260.0, 516.9, 524.95, 543.98, 9.874105159219946, 82.43527832633917, 13.6268436805727], "isController": false}, {"data": ["Redirected to landing page", 200, 3, 1.5, 337.56, 244, 1124, 261.0, 773.5, 896.5999999999999, 1107.8400000000001, 9.818842358485934, 73.24655036452452, 17.124818581545487], "isController": false}, {"data": ["Initiate Funds Transfer-0", 9, 0, 0.0, 261.8888888888889, 253, 269, 264.0, 269.0, 269.0, 269.0, 29.12621359223301, 3.6123331310679614, 39.01825444983819], "isController": false}, {"data": ["Click on Logout-1", 200, 0, 0.0, 258.68, 243, 301, 257.5, 267.0, 272.9, 285.0, 9.814505839630975, 90.1132655314555, 16.62887826332319], "isController": false}, {"data": ["Click on Logout-0", 200, 0, 0.0, 266.90999999999985, 239, 534, 256.5, 266.0, 273.0, 533.8800000000001, 9.820288716488264, 1.208355838161642, 16.64826641215752], "isController": false}, {"data": ["Click on Logout", 200, 0, 0.0, 525.925, 483, 805, 515.0, 535.0, 551.0, 801.95, 9.694619486185166, 90.20540475036356, 32.86097309743093], "isController": false}, {"data": ["Visit Transfer Funds Page", 200, 13, 6.5, 306.84000000000015, 242, 1137, 262.0, 353.30000000000007, 563.8499999999999, 1126.4900000000005, 9.806325079676391, 96.24491488416278, 17.181323164378526], "isController": false}, {"data": ["Redirected to landing page-1", 9, 0, 0.0, 266.3333333333333, 258, 277, 264.0, 277.0, 277.0, 277.0, 28.037383177570092, 233.663113317757, 32.22047799844237], "isController": false}, {"data": ["Transaction Controller", 200, 28, 14.0, 2679.285, 2225, 4302, 2444.0, 3383.8, 3608.65, 4025.100000000001, 8.680932332132471, 541.2787657613177, 131.8330975465515], "isController": true}, {"data": ["Login Process", 200, 12, 6.0, 587.875, 370, 1414, 520.5, 822.2000000000003, 1163.4999999999995, 1379.94, 9.69791010037337, 82.34586384134218, 31.924402517819907], "isController": false}, {"data": ["Login Process-1", 191, 3, 1.5706806282722514, 293.633507853403, 243, 1117, 259.0, 274.8, 305.1999999999996, 1107.7999999999997, 9.386210624600718, 69.57771458364047, 16.884179658705587], "isController": false}, {"data": ["Initiate Funds Transfer", 200, 18, 9.0, 351.965, 258, 1239, 289.0, 517.5, 646.8999999999997, 1230.8300000000002, 9.795758436596953, 95.5300251475486, 18.9499138279375], "isController": false}, {"data": ["Initiate Funds Transfer-1", 9, 0, 0.0, 264.44444444444446, 255, 277, 267.0, 277.0, 277.0, 277.0, 27.190332326283986, 226.60380475830814, 33.663378021148034], "isController": false}, {"data": ["Login Process-0", 191, 0, 0.0, 287.7486910994766, 241, 1152, 258.0, 272.8, 547.5999999999987, 1015.8399999999976, 9.386210624600718, 13.355184453167231, 14.900052674578603], "isController": false}, {"data": ["Redirected to landing page-0", 9, 0, 0.0, 518.7777777777778, 507, 538, 519.0, 538.0, 538.0, 538.0, 16.18705035971223, 2.007573628597122, 18.665341164568343], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain /was successfully transferred from Account/", 10, 20.408163265306122, 0.4472271914132379], "isController": false}, {"data": ["500/Internal Server Error", 30, 61.224489795918366, 1.3416815742397137], "isController": false}, {"data": ["Test failed: text expected to contain /Transfer Funds/", 9, 18.367346938775512, 0.40250447227191416], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2236, 49, "500/Internal Server Error", 30, "Test failed: text expected to contain /was successfully transferred from Account/", 10, "Test failed: text expected to contain /Transfer Funds/", 9, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Redirected to landing page", 200, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Visit Transfer Funds Page", 200, 13, "Test failed: text expected to contain /Transfer Funds/", 9, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Login Process", 200, 12, "500/Internal Server Error", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Login Process-1", 191, 3, "500/Internal Server Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Initiate Funds Transfer", 200, 18, "Test failed: text expected to contain /was successfully transferred from Account/", 10, "500/Internal Server Error", 8, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
