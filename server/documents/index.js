import moment from 'moment'

export default function (
   { name,
      address,
      phone,
      email,
      dueDate,
      date,
      id,
      notes,
      subTotal,
      type,
      vat,
      total,
      items,
      status,
      totalAmountReceived,
      balanceDue,
      company,
      currency,
   }) {
    const today = new Date();
return `
<!DOCTYPE html>
<html>
<head>
<style>

.invoice-container {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    width: 100%;
}

.header-container {
    background-color: #f5f5f5;
    padding: 40px 0;
    width: 100%;
    margin-bottom: 40px;
}

.header-content {
    width: 90%;
    margin: 0 auto;
    position: relative;
    height: 120px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.header-left {
    display: flex;
    align-items: center;
}

.header-left img {
    width: 45px;
    height: auto;
    object-fit: contain;
}

.header-right {
    text-align: right;
}

.invoice-title {
    color: #666;
    font-size: 48px;
    font-weight: normal;
    margin: 0;
}

.invoice-details {
    margin-top: 5px;
}

.invoice-label {
    color: #666;
    font-size: 12px;
    margin: 0;
    font-weight: normal;
}

.invoice-number {
    color: #333;
    font-size: 14px;
    margin: 2px 0 0 0;
    font-weight: normal;
}

.invoice-container {
    margin: 0;
    padding: 0;
    padding-top: 10px;
    font-family: 'Roboto', sans-serif;
    width: 530px;
    margin: 0px auto;
    }

table {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

table td, table th {
  border: 1px solid rgb(247, 247, 247);
  padding: 10px;
}

table tr:nth-child(even){background-color: #f8f8f8;}

table tr:hover {background-color: rgb(243, 243, 243);}

table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #FFFFFF;
  color: rgb(78, 78, 78);
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 5px;
    

}
.address {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px 0px 15px 0px;
    line-height: 10px;
    font-size: 12px;
    margin-top: -20px

}

.status {
    text-align: right;
}
.receipt-id {
    text-align: right;
}

.title {
    font-weight: 100px;
    text-transform: uppercase;
    color: gray;
    letter-spacing: 2px;
    font-size: 8px;
    line-height: 5px;
}

.summary {
    margin-top: 2px;
    margin-right: 0px;
    margin-left: 50%;
    margin-bottom: 15px;
}

img {
    width: 100px;
   
}

</style>
</head>
<body>
<div class="invoice-container">
    <div class="header-container">
        <div class="header-content">
            <div class="header-left">
                ${company?.logo ? 
                    `<img src="${company?.logo}" alt="${company?.businessName || '---'}" />` 
                    : 
                    `<h2>${company?.businessName || '---'}</h2>`
                }
            </div>
            <div class="header-right">
                <h1 class="invoice-title">Invoice</h1>
                <div class="invoice-details">
                    <p class="invoice-label">NO.</p>
                    <p class="invoice-number">${id}</p>
                </div>
            </div>
        </div>
    </div>
    
    <div style="width: 90%; margin: 0 auto;">
        <section class="address">
            <div>
                <p class="title">From:</p>
                <h4 style="font-size: 12px; line-height: 1.5; margin: 5px 0">${company?.businessName || company?.name || '---'}</h4>
                <p style="font-size: 11px; line-height: 1.5; margin: 5px 0">${company?.email || '---'}</p>
                <p style="font-size: 11px; line-height: 1.5; margin: 5px 0">${company?.phoneNumber || '---'}</p>
                <p style="font-size: 11px; line-height: 1.5; margin: 5px 0">${company?.contactAddress || '---'}</p>
            </div>

            <div style="margin-bottom: 100px; margin-top: 20px">
            <p class="title">Bill to:</p>
              <h4 style="font-size: 9px; line-height: 5px">${name}</h4>
              <p style="font-size: 9px; line-height: 5px">${email}</p>
              <p style="font-size: 9px; line-height: 5px">${phone}</p>
              <p style="font-size: 9px; line-height: 5px">${address}</p>
            </div>

          <div class="status" style="margin-top: -280px">
              <h1 style="font-size: 12px">${Number(balanceDue) <= 0 ? 'Receipt' : type}</h1>
              <p style="font-size: 8px; margin-bottom: 10px">${id}</p>
              <p class="title" style="font-size: 8px">Status</p>
              <h3 style="font-size: 12px">${status}</h3>
              <p class="title" style="font-size: 8px">Date</p>
              <p  style="font-size: 9px" >${moment(date).format('ll')}</p>
              <p class="title"  style="font-size: 8px">Due Date</p>
              <p  style="font-size: 9px">${moment(dueDate).format('ll')}</p>
              <p class="title"  style="font-size: 8px">Amount</p>
              <h3 style="font-size: 12px">${total}</h3>
          </div>
      </section>

      <table>
        <tr>
          <th style="font-size: 9px">Item</th>
          <th style="font-size: 9px">Quantity</th>
          <th style="font-size: 9px">Price</th>
          <th style="font-size: 9px">Discount(%)</th>
          <th style="text-align: right; font-size: 9px">Amount</th>
        </tr>

        ${
         items.map((item) => (
       `  <tr>
          <td style="font-size: 9px">${item.itemName}</td>
          <td style="font-size: 9px">${item.quantity}</td>
          <td style="font-size: 9px">${currency} ${item.unitPrice}</td>
          <td style="font-size: 9px">${item.discount}</td>
          <td style="text-align: right; font-size: 9px">${currency} ${(item.quantity * item.unitPrice) - (item.quantity * item.unitPrice) * item.discount / 100}</td>
        </tr>`
         ))
        }


      </table>

      <section class="summary">
          <table>
              <tr>
                <th style="font-size: 9px">Invoice Summary</th>
                <th></th>
              </tr>
              <tr>
                <td style="font-size: 9px">Sub Total</td>
                <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${subTotal}</td>
              </tr>

              <tr>
                  <td style="font-size: 10px">VAT</td>
                  <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${vat}</td>
                </tr>

              <tr>
                  <td style="font-size: 10px">Total</td>
                  <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${total}</td>
                </tr>

              <tr>
                  <td style="font-size: 10px" >Paid</td>
                  <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${totalAmountReceived}</td>
                </tr>

                <tr>
                <td style="font-size: 9px">Balance Due</td>
                <td style="text-align: right; font-size: 9px; font-weight: 700">${currency} ${balanceDue}</td>
              </tr>
              
            </table>
        </section>
        <div>
            <hr>
            <h4 style="font-size: 9px">Note</h4>
            <p style="font-size: 9px">${notes}</p>
        </div>
</div>
</div>
</body>
</html>`
;
};