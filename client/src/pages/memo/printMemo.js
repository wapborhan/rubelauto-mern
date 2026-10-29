export const printMemo = (memos, calculateAmount, totals, name) => {
  let html = `
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 0; position: relative; }
          h2 { text-align: center; }
          table { border-collapse: collapse; width: 100%; margin-top: 5px; }
          th, td { border: 1px solid #333; padding: 3px; text-align: left; }
          th { background-color: #f0f0f0;text-align: center; }
          td:first-child, th:first-child { text-align: left; }
          .memoHead {margin-bottom: 5px;}
          .memoHeadRow {display: flex;justify-content: space-between;gap: 32px;flex-wrap: wrap;}
          .customer, .chalan {flex: 1;min-width: 220px;}
          .customer h3,.chalan h3 {margin: 0px 0;font-size: 16px;color: #333;}
          .memoHead b {color: #000;}
          .company{display:flex;justify-content:center;align-items:start;margin-bottom:15px;position: relative;}.companyInner{display:flex;gap:24px;align-items:center;flex-wrap:wrap;text-align:center;position: relative}.companyLogo{width:85px;aspect-ratio:1/1;object-fit:contain;position: absolute;left: 0;}.companyInfo h2{margin:0 0 8px;font-size:30px;font-weight:700;color:#222}.companyInfo p{margin:4px 0;font-size:16px;color:#555} 
          .signatures {display: flex;justify-content: space-between; gap: 16px;flex-wrap: wrap;     position: static;  padding-top: 90px;  width: 100%;    bottom: -0;.signature-line {flex: 1;text-align: center;padding-top: 8px;border-top: 2px solid #000;font-weight: 500;color: #333;min-width: 150px;}
        </style>
      </head>
      <body>
      <div class="company">
          <img
            src="images/logo/logo-squire.png"
            alt="RS"
            class="companyLogo"
          />
        <div class="companyInner">
          <div class="companyInfo">
            <h2>Rubel Auto</h2>
            <p>High Road, Bheramara, Kushtia, Khulna.</p>
            <p>Mobile: 01719-033880, 01722-770694</p>
            <p>Email: mail.rubelauto@gmail.com, Web: www.rubelauto.com</p>
          </div>
        </div>
      </div>
        <div class="memoHead">
          <div class="memoHeadRow">
            <div class="customer">
              <h3><b>Name:</b> Rubel Auto</h3>
              <h3><b>Address:</b> High Road</h3>
              <h3><b>Contact:</b> 01712345678</h3>
            </div>
            <div class="chalan">
              <h3><b>Memo No:</b> ${memos.length ? memos[0].id : "N/A"}</h3>
              <h3><b>Date:</b> ${new Date().toLocaleDateString()}</h3>
              <h3><b>Memo By:</b> ${name}</h3>
            </div>
          </div>
        </div>

        <h2 style="text-align:center; margin: 10px 0 10px 0">Invoice</h2>

        <table style="padding-bottom: 95px; width: 100%;">
          <thead>
            <tr>
             <th>Sl.</th>
              <th>Product Name</th>
              <th>Model</th>
              <th>Brand</th>
              <th>Qty</th>
              <th>Rate</th>
              <th>Dis(%)</th>
              <th>Total Amount</th>
            </tr>
          </thead>
          <tbody>`;

  memos.forEach((item, idx) => {
    html += `
      <tr style="text-align: left">
        <td>${idx + 1}</td>
        <td>${item.description}  ${item.partNo}</td>
        <td style="text-align: center;">${item.model}</td>
        <td style="text-align: center;">${item.company}</td>
        <td style="text-align: center;">${
          item.quantity + " " + item?.unitType
        }</td>
        <td style="text-align: center;">${item.rate}</td>
        <td style="text-align: center;">${item.discount}</td>
        <td style="text-align:right">${calculateAmount(item).toFixed(2)}</td>
      </tr>`;
  });

  html += `
    <tr>
     

      <td colspan="7" style="text-align:right"><strong>Total Amount</strong></td>
      <td style="text-align:right">${totals.totalAmount().toFixed(2)}
      </td>
    </tr>
    <tr>
      <td colspan="7" style="text-align: right"><strong>Previous Due:</strong></td>
      <td style="text-align:right">${totals.prevDue}</td>
    </tr>

    <tr>
      <td colspan="7" style="text-align: right"><strong>Transport:</strong></td>
      <td style="text-align:right">${totals.transport}</td>
    </tr>
    <tr>
      <td colspan="7" style="text-align: right"><strong>Grand Total:</strong></td>
      <td style="text-align:right">${totals.grandTotal().toFixed(2)}</td>
    </tr>
    </tbody>
  </table>
  <div class="signatures">
    <div class="signature-line">Prepared By</div>
    <div class="signature-line">Authorised By</div>
    <div class="signature-line">Received By</div>
  </div>

           <script>
       window.onload = function() {
         window.print();
      };
     </script>
    </body>
  </html>`;

  const printWindow = window.open("", "_blank");
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  // Create an invisible iframe
  // const iframe = document.createElement("iframe");
  // iframe.style.position = "fixed";
  // iframe.style.right = "0";
  // iframe.style.bottom = "0";
  // iframe.style.width = "0";
  // iframe.style.height = "0";
  // iframe.style.border = "0";
  // document.body.appendChild(iframe);

  // // Write to iframe and print
  // iframe.contentDocument.open();
  // iframe.contentDocument.write(html);
  // iframe.contentDocument.close();

  // iframe.onload = function () {
  //   iframe.contentWindow.focus();
  //   iframe.contentWindow.print();
  //   setTimeout(() => document.body.removeChild(iframe), 1000); // Clean up after print
  // };
};
