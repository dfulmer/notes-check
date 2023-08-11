/**
 * Note Check
 *
 * @customfunction
 */

var apikey = 'your_api_key';

function GETNOTES(input) {
  if (input){
    var limit = 100;
    var offset = 0;
    var url = 'https://api-na.hosted.exlibrisgroup.com/almaws/v1/acq/invoices/?limit='+limit+'&offset='+offset+'&invoice_workflow_status=Waiting%20to%20be%20Sent&apikey='+apikey;
    var xml = UrlFetchApp.fetch(url).getContentText();
    var document = XmlService.parse(xml);
    var totalRecordCount = document.getRootElement().getAttribute('total_record_count').getValue();
    xml = xml.replace(/<\?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"\?><invoices total_record_count=\"\d+\">/, "");
    xml = xml.replace(/<\/invoices>/, "");
    var fullResponse = xml;

    while (totalRecordCount > offset + limit) {
      offset += 100;
      var url = 'https://api-na.hosted.exlibrisgroup.com/almaws/v1/acq/invoices/?limit='+limit+'&offset='+offset+'&invoice_workflow_status=Waiting%20to%20be%20Sent&apikey='+apikey;
      var xml = UrlFetchApp.fetch(url).getContentText();
      xml = xml.replace(/<\?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"\?><invoices total_record_count=\"\d+\">/, "");
      xml = xml.replace(/<\/invoices>/, "");
      fullResponse = fullResponse.concat(xml);
    }
    
    fullResponse = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><invoices total_record_count="">' + fullResponse + '</invoices>';
    var documentB = XmlService.parse(fullResponse);
    var invoices = documentB.getRootElement().getChildren('invoice');

    var invoiceArray = [];
    var space = [" "];
    var invoiceArrayBad = ["These below are not okay"];

    for (var i = 0; i < invoices.length; i++) { 
      var invoiceGoodorBad = 1;
      var invoiceNumber = invoices[i].getChild('number').getText();
      var vendorCode = invoices[i].getChild('vendor').getText();
      var referenceNumber = invoices[i].getChild('reference_number').getText();
      if (!referenceNumber) {
        invoiceArrayBad.push(["No batch number",invoiceNumber," ",vendorCode," "]);
        referenceNumber = 'none';
      }
      var invoiceNotes = invoices[i].getChild('notes');
      if (invoiceNotes) {
        var invoiceNote = invoiceNotes.getChildren('note');
        for (var j = 0; j < invoiceNote.length; j++) {
          var noteContent = invoiceNote[j].getChild('content').getText();
          var patt = /^Act......,.............-...,.,\[p\]$/;
          var goodOrBad = patt.test(noteContent);
          if (goodOrBad) {
            var pattern = "Yes";
            invoiceGoodorBad = 2;
          } else {
            var pattern = "No";
          }
          invoiceArray.push([pattern,invoiceNumber,referenceNumber,vendorCode,noteContent]);
        }
        if (invoiceGoodorBad < 2){
          invoiceArrayBad.push(["No good note",invoiceNumber,referenceNumber,vendorCode," "]);
        }
      } else {
        invoiceArray.push(["No lines",invoiceNumber,referenceNumber,vendorCode,"No lines"]);
        invoiceArrayBad.push(["No lines",invoiceNumber,referenceNumber,vendorCode,"No lines"]);
      }
    }
    var okayMessage = ["These below are all notes"];
    invoiceArrayE = invoiceArrayBad.concat(space).concat(okayMessage).concat(invoiceArray);
    return invoiceArrayE;
  }
}