function buildReceipt({
  lineItems,
  total,
  shipping_address,
  billing_address,
  last_four,
  receipt_number,
}) {
  let lineItemsHtml = ``;

  lineItems.forEach((x) => {
    lineItemsHtml = `${lineItemsHtml}
        <tr class="item">
          <td>${x.label}</td>
          <td>$${x.amount.toFixed(2)}</td>
        </tr>`;
  });

  return `
  <head><style>

  .helper{
    color: #8c8c8c;
    font-size: 12px;
    font-style: italic;
  }

  .invoice-box {
      max-width: 800px;
      margin: auto;
      padding: 30px;
      border: 1px solid #eee;
      box-shadow: 0 0 10px rgba(0, 0, 0, .15);
      font-size: 16px;
      line-height: 24px;
      font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
      color: #555;
  }
  
  .invoice-box table {
      width: 100%;
      line-height: inherit;
      text-align: left;
  }
  
  .invoice-box table td {
      padding: 5px;
      vertical-align: top;
  }
  
  .invoice-box table tr td:nth-child(2) {
      text-align: right;
  }
  
  .invoice-box table tr.top table td {
      padding-bottom: 20px;
  }
  
  .invoice-box table tr.top table td.title {
      font-size: 45px;
      line-height: 45px;
      color: #333;
      text-align: center;
  }
  
  .invoice-box table tr.information table td {
      padding-bottom: 40px;
  }
  
  .invoice-box table tr.heading td {
      background: #eee;
      border-bottom: 1px solid #ddd;
      font-weight: bold;
  }
  
  .invoice-box table tr.details td {
      padding-bottom: 20px;
  }
  
  .invoice-box table tr.item td{
      border-bottom: 1px solid #eee;
  }
  
  .invoice-box table tr.item.last td {
      border-bottom: none;
  }
  
  .invoice-box table tr.total td:nth-child(2) {
      border-top: 2px solid #eee;
      font-weight: bold;
  }
  
  @media only screen and (max-width: 600px) {
      .invoice-box table tr.top table td {
          width: 100%;
          display: block;
          text-align: center;
      }
      
      .invoice-box table tr.information table td {
          width: 100%;
          display: block;
          text-align: center;
      }
  }
  
  /** RTL **/
  .rtl {
      direction: rtl;
      font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  }
  
  .rtl table {
      text-align: right;
  }
  
  .rtl table tr td:nth-child(2) {
      text-align: left;
  }
  </style></head>
  <body><div class="invoice-box">
      <table cellpadding="0" cellspacing="0">
        <tr class="top">
          <td colspan="2">
            <table>
              <tr>
                <td class="title" >
                  <img
                    src="http://shelbykcook.com/static/media/treeline.c772c96b.png"
                    style="width: 100%; max-width: 300px"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Order Summary
                   <br />
                   Receipt Number: ${receipt_number}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="top">
          <td colspan="2">
            <table>
              <tr>
                <td>
                  Hello ${shipping_address.first_name} ${
    shipping_address.last_name
  }, Thank you for your purchase from <a href="https://shelbykcook.com/">shelbykcook.com</a>! Here
                  is a summary of your order: <br/>
                  <span class="helper">please allow 1-2 weeks for packing and shipping</span>
                </td>
              </tr><tr>
              
            </tr>
            </table>
          </td>
        </tr>

        <tr class="information">
          <td colspan="2">
            <table>
              <tr>
                <td>
                  <b>Shipping Information:</b>
                  <br />
                  ${shipping_address.first_name} ${shipping_address.last_name},
                  <br />
                  ${shipping_address.address_line_1} 
                  ${shipping_address.address_line_2 || ""}
                  <br />
                  ${shipping_address.locality}, 
                  ${shipping_address.administrative_district_level_1} 
                  ${shipping_address.postal_code}
                  <br />
                </td>

                <td>
                  <b>Billing Information:</b>
                  <br />
                  ${billing_address.first_name} ${billing_address.last_name},
                  <br />
                  ${billing_address.address_line_1} 
                  ${billing_address.address_line_2 || ""}
                  <br />
                  ${billing_address.locality}, 
                  ${billing_address.administrative_district_level_1} 
                  ${billing_address.postal_code}
                  <br />
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr class="heading">
          <td>Payment Method</td>
          <td></td>
        </tr>

        <tr class="details">
          <td>Credit Card</td>
          <td>${last_four}</td>
        </tr>

        <tr class="heading">
          <td>Item</td>
          <td>Price</td>
        </tr>


        ${lineItemsHtml}

        <tr class="total">
          <td></td>

          <td>Total: $${total.toFixed(2)}</td>
        </tr>
      </table>
    </div></body>`;
}

module.exports = buildReceipt;
