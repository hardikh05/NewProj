import moment from 'moment'

export default function (
    { 
      dueDate,
      type,
      balanceDue,
      company,
      link,
      id,
      
   }) {
    // const today = new Date();
return `
<!DOCTYPE html>
<html>
    <head>
       <style>
           html, body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    width: 100%;
}

.layout {
    background-color: #EEEEEE;
    font-family: "Roboto";
    width: 100%;
    color: #484b5b;
    padding: 20px 0;
}

.content {
    text-align: center;
    background-color: white;
    width: 75%;
    margin: 0 auto;
    padding: 25px;
}

.name {
    line-height: 20px;
    font-size: 24px;
    
}

.logo {
    width: 150px;
    margin: 0px auto;
}

hr {
  border: 0;
  clear:both;
  display:block;
  width: 96%;               
  background-color: #d1d1d1;
  height: 1px;
  margin-top: 20px;
}


.link-container {
  padding: 25px; 
  margin: 0 auto;
}

.invoice-link {
    padding: 18px 30px;
    background-color: #1a64db;
    width: 50%;
    margin: 0 auto;
    border-radius: 50px;
    border: none;
    color: white;
    font-size: 18px;
    text-decoration: none;
    
}

.address {
    text-align: center
}

.address p {
    line-height: 7px;
    font-size: 15px
}

.address h2 {
    font-size: 17px
}


.footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
}

.footer-logo {
    width: 50px;
    margin: 20px auto;
    display: block
    
}

@media only screen and (max-width: 600px) {
  content {
    width: 100%;
  }

  invoice-link {
    width: 100%;
  }
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

.layout {
    background-color: #EEEEEE;
    font-family: "Roboto";
    width: 100%;
    color: #484b5b;
    padding: 20px 0;
}

.content {
    text-align: center;
    background-color: white;
    width: 75%;
    margin: 0 auto;
    padding: 25px;
}
       </style>
    </head>
    
    
    
    <body>
        <div class="layout">
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
            <div class="content">
                ${company?.logo ? 
                  `<img src="${company?.logo}" class="logo" style="width: 150px; height: auto; object-fit: contain; margin: 10px auto; display: block;" />` 
                  : 
                  `<h2 style="color: #484b5b; font-size: 24px; text-align: center; margin: 20px 0;">${company?.businessName || '---'}</h2>`
                }
                <h1 class="name" style="margin: 20px 0; color: #484b5b;">${company?.businessName || company?.name || '---'}</h1>
                
                  <hr style="margin: 20px auto; width: 90%; border: none; height: 1px; background-color: #eee;" />
                  <div>
                      <p style="font-size: 18px; line-height: 1.6; color: #484b5b; margin: 15px 0;">
                        ${Number(balanceDue) <= 0 ? 'Thank you for your business' : type} 
                        ${Number(balanceDue) != 0 ? 'for' : ''} 
                        <span style="font-weight: 700">${Number(balanceDue) <= 0 ? '' : balanceDue}</span> 
                        ${Number(balanceDue) <= 0 ? '' : `due by`} 
                        <span style="font-weight: 700">${Number(balanceDue) <= 0 ? '' : moment(dueDate).format("MMM Do YYYY")}</span>
                      </p>
                  </div>
                  
                  <div class="link-container" style="margin: 30px auto;">
                      <a href="${link}" class="invoice-link" style="color: white; text-decoration: none; background-color: #1a64db; padding: 15px 30px; border-radius: 25px; display: inline-block;">
                        ${Number(balanceDue) <= 0 ? 'View Receipt' : `View ${type}`}
                      </a>
                  </div>
                  
                  <div class="address" style="margin-top: 30px;">
                      <h2 style="color: #484b5b; font-size: 18px; margin: 10px 0;">${company?.businessName || '---'}</h2>
                      <p style="color: #666; font-size: 14px; margin: 5px 0;">${company?.phoneNumber || '---'}</p>
                      <p style="color: #666; font-size: 14px; margin: 5px 0;">${company?.website ? company?.website : ''}</p>
                  </div>
            </div>
            
          <div class"footer">
              <a href="https://echoinvoice.com">
              <img class="footer-logo" src="/icons/icon-64x64.png" alt="echo-invoice"/>
            </a>
          </div>
        <p style="text-align: center">Make beautiful invoice for free at echoinvoice.com</p>
        </div>
    </body>
</html>`
;
};