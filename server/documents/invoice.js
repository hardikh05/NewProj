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
   }) {
    const today = new Date();
return `<!DOCTYPE html>
<html>
<head>
<style>
body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    width: 100%;
    color: #333;
}

.header-container {
    background-color: #f5f5f5;
    padding: 25px 0;
    width: 100%;
    margin-bottom: 30px;
}

.header-content {
    width: 90%;
    margin: 0 auto;
    position: relative;
    height: 80px;
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
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.invoice-number-container {
    margin-bottom: 5px;
}

.invoice-label {
    color: #666;
    font-size: 10px;
    margin: 0;
    font-weight: normal;
    text-transform: uppercase;
}

.invoice-number {
    color: #333;
    font-size: 12px;
    margin: 1px 0 0 0;
    font-weight: normal;
}

.invoice-title {
    color: #666;
    font-size: 42px;
    font-weight: normal;
    margin: 0;
    line-height: 1;
}

.content {
    width: 90%;
    margin: 0 auto;
}

.address {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
}

.contact {
    display: flex;
    gap: 80px;
}

.contact div {
    flex: 1;
}

.contact h4 {
    color: #333;
    font-size: 16px;
    margin: 0 0 10px 0;
}

.contact p {
    color: #666;
    font-size: 14px;
    margin: 5px 0;
    line-height: 1.4;
}

.title {
    font-size: 12px;
    text-transform: uppercase;
    color: #666;
    letter-spacing: 1px;
    margin: 0 0 10px 0;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin: 30px 0;
}

table th {
    background-color: #f8f8f8;
    padding: 12px 15px;
    text-align: left;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    border-bottom: 1px solid #eee;
}

table td {
    padding: 12px 15px;
    font-size: 14px;
    color: #666;
    border-bottom: 1px solid #eee;
}

.summary {
    width: 40%;
    margin-left: auto;
    margin-top: 30px;
}

.summary table {
    margin: 0;
}

.summary table th {
    background-color: transparent;
    font-size: 14px;
    color: #666;
}

.summary table td {
    text-align: right;
    font-weight: 500;
    color: #333;
}

.notes {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.notes h4 {
    color: #333;
    font-size: 16px;
    margin: 0 0 10px 0;
}

.notes p {
    color: #666;
    font-size: 14px;
    margin: 0;
    line-height: 1.4;
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
                <div class="invoice-number-container">
                    <p class="invoice-label">NO.</p>
                    <p class="invoice-number">${id}</p>
                </div>
                <h1 class="invoice-title">Invoice</h1>
            </div>
        </div>
    </div>
    
    <div style="width: 90%; margin: 0 auto;">
        <section class="address">
            <div class="contact">
                <div>
                    <h4>${company?.businessName || '---'}</h4>
                    <p>${company?.email || '---'}</p>
                    <p>${company?.phoneNumber || '---'}</p>
                    <p>${company?.contactAddress || '---'}</p>
                </div>
                <div>
                    <p class="title">Bill to:</p>
                    <h4>${name}</h4>
                    <p>${email}</p>
                    <p>${phone}</p>
                    <p>${address}</p>
                </div>
            </div>
            <div class="status">
                <p class="title">Status</p>
                <h3>${status}</h3>
                <p class="title">Date</p>
                <p>${moment(date).format('MMM DD, YYYY')}</p>
                <p class="title">Due Date</p>
                <p>${moment(dueDate).format('MMM DD, YYYY')}</p>
            </div>
        </section>

        <table>
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Discount(%)</th>
                    <th style="text-align: right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${items.map((item) => `
                    <tr>
                        <td>${item.itemName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.unitPrice}</td>
                        <td>${item.discount}</td>
                        <td style="text-align: right">${(item.quantity * item.unitPrice) - (item.quantity * item.unitPrice) * item.discount / 100}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="summary">
            <table>
                <tr>
                    <th>Subtotal</th>
                    <td>${subTotal}</td>
                </tr>
                <tr>
                    <th>VAT (${vat}%)</th>
                    <td>${(total - subTotal).toFixed(2)}</td>
                </tr>
                <tr>
                    <th>Total</th>
                    <td>${total}</td>
                </tr>
                <tr>
                    <th>Amount Paid</th>
                    <td>${totalAmountReceived}</td>
                </tr>
                <tr>
                    <th>Balance Due</th>
                    <td>${balanceDue}</td>
                </tr>
            </table>
        </div>

        <div class="notes">
            <h4>Notes</h4>
            <p>${notes || 'No notes'}</p>
        </div>
    </div>
</div>
</body>
</html>
`;
}