import React from "react";
import "../styles/Billing.css"

export default () => {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">HRCLOUDX</div>
        
        <div className="divider"></div>
        
        <nav className="nav-menu">
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/hmqpmay4_expires_30_days.png" 
            text="Dashboard" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/z06o8o00_expires_30_days.png" 
            text="Profile" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/rz3od6et_expires_30_days.png" 
            text="New Hires" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/557voprd_expires_30_days.png" 
            text="Employees" 
          />
          <MenuItem 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/6yzmslw0_expires_30_days.png" 
            text="Billing" 
            active 
          />
        </nav>
        
        <div className="upgrade-card">
          <img 
            src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/c3gcj8eo_expires_30_days.png" 
            className="upgrade-icon"
            alt="Upgrade" 
          />
          <div className="upgrade-text">
            <div>Upgrade to PRO</div>
            <small>to get access to all features!</small>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="breadcrumbs">
            <span>Pages / Billing</span>
            <h1>Billing</h1>
          </div>
          
          <div className="user-profile">
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/2bb4edd4-293b-43c8-b39f-493a2edb1d91" alt="User" />
            <span>Doe, Jane</span>
            <img src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/082c3bf8-01b8-4766-8555-99763cf21464" alt="Dropdown" />
          </div>
        </header>
        
        {/* Payment Cards */}
        <div className="card-row">
          <PaymentCard 
            logo="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/4a0s3ehi_expires_30_days.png"
            number="7812 2139 0823 XXXX" 
            expiry="05/24" 
            cvv="09X"
          />
          <PaymentMethod 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/vxv57pzf_expires_30_days.png" 
            title="Salary" 
            amount="+$2000" 
            color="#4318FF"
          />
          <PaymentMethod 
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/358903cd_expires_30_days.png" 
            title="Paypal" 
            amount="$455.00" 
            color="#2D3748"
          />
        </div>
        
        {/* Combined Content Area */}
        <div className="combined-content">
          {/* Left Column */}
          <div className="content-column">
            {/* Payment Methods Section */}
            <section className="payment-methods">
              <div className="section-header">
                <h3>Payment Method</h3>
                <button className="add-card-btn">ADD A NEW CARD</button>
              </div>
              
              <div className="cards-list">
                <SavedCard 
                  icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/lyn2slbm_expires_30_days.png"
                  number="7812 2139 0823 XXXX" 
                  active
                />
                <SavedCard 
                  icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/8rtvtp5o_expires_30_days.png"
                  number="7812 2139 0823 XXXX" 
                />
              </div>
            </section>
            
            {/* Billing Information */}
            <section className="billing-info">
              <h3>Billing Information</h3>
              
              <div className="info-cards">
                <InfoCard 
                  name="Oliver Liam" 
                  company="Viking Burrito" 
                  email="oliver@burrito.com" 
                  vat="FRB1235476"
                  deleteIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/136x2u2r_expires_30_days.png"
                  editIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7otne8qi_expires_30_days.png"
                />
                <InfoCard 
                  name="Oliver Liam" 
                  company="Viking Burrito" 
                  email="oliver@burrito.com" 
                  vat="FRB1235476"
                  deleteIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/8gp8cepw_expires_30_days.png"
                  editIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/mpsu2ukv_expires_30_days.png"
                />
                <InfoCard 
                  name="Oliver Liam" 
                  company="Viking Burrito" 
                  email="oliver@burrito.com" 
                  vat="FRB1235476"
                  deleteIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/vzrk6yfn_expires_30_days.png"
                  editIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/4bui3bmk_expires_30_days.png"
                />
              </div>
            </section>
          </div>
          
          {/* Right Column (former sidebar content) */}
          <div className="content-column">
            {/* Invoices Section */}
            <section className="invoices">
              <div className="section-header">
                <h4>Invoices</h4>
                <button className="view-all">VIEW ALL</button>
              </div>
              
              <InvoiceItem 
                date="March, 01, 2020" 
                id="#MS-415646" 
                amount="$180" 
                pdfIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/ooymt6ca_expires_30_days.png"
              />
              <InvoiceItem 
                date="February, 10, 2021" 
                id="#RV-126749" 
                amount="$250" 
                pdfIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7i42j92c_expires_30_days.png"
              />
              <InvoiceItem 
                date="April, 05, 2020" 
                id="#FB-212562" 
                amount="$560" 
                pdfIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/kl8fuv50_expires_30_days.png"
              />
              <InvoiceItem 
                date="June, 25, 2019" 
                id="#QW-103578" 
                amount="$120" 
                pdfIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/dc9dvqi5_expires_30_days.png"
              />
              <InvoiceItem 
                date="March, 01, 2019" 
                id="#AR-803481" 
                amount="$300" 
                pdfIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/dc04btsr_expires_30_days.png"
              />
            </section>
            
            {/* Transactions Section */}
            <section className="transactions">
              <div className="section-header">
                <h4>Your Transactions</h4>
                <img 
                  src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/dkw918rr_expires_30_days.png" 
                  alt="Calendar" 
                />
                <span>23 - 30 March 2020</span>
              </div>
              
              <div className="time-label">NEWEST</div>
              <Transaction 
                icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/pdddaden_expires_30_days.png" 
                name="Netflix" 
                date="27 March 2020, at 12:30 PM" 
                amount="-$2500" 
                type="outgoing"
              />
              <Transaction 
                icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/3a1pu034_expires_30_days.png" 
                name="Apple" 
                date="27 March 2020, at 12:30 PM" 
                amount="+$2500" 
                type="incoming"
              />
              
              <div className="time-label">YESTERDAY</div>
              <Transaction 
                icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/3v1fock8_expires_30_days.png" 
                name="Stripe" 
                date="26 March 2020, at 13:45 PM" 
                amount="+$800" 
                type="incoming"
              />
              <Transaction 
                icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/8ydi38hh_expires_30_days.png" 
                name="HubSpot" 
                date="26 March 2020, at 12:30 PM" 
                amount="+$1700" 
                type="incoming"
              />
              <Transaction 
                icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/q1cq342g_expires_30_days.png" 
                name="Webflow" 
                date="26 March 2020, at 05:00 AM" 
                amount="Pending" 
                type="pending"
              />
              <Transaction 
                icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/x3lgpmba_expires_30_days.png" 
                name="Microsoft" 
                date="25 March 2020, at 16:30 PM" 
                amount="-$987" 
                type="outgoing"
              />
            </section>
          </div>
        </div>
        
        <footer className="footer">
          © 2024 HRCloudX. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
}

// Reusable Components (remain the same as in your original code)
const MenuItem = ({ icon, text, active = false }) => (
  <div className={`menu-item ${active ? 'active' : ''}`}>
    <img src={icon} alt={text} className="menu-icon" />
    <span>{text}</span>
  </div>
);

const PaymentCard = ({ logo, number, expiry, cvv }) => (
  <div className="payment-card">
    <div className="card-header">
      <span>HRCloudX</span>
      <img src={logo} alt="Card" className="card-logo" />
    </div>
    <div className="card-number">{number}</div>
    <div className="card-footer">
      <div>
        <small>VALID THRU</small>
        <span>{expiry}</span>
      </div>
      <div>
        <small>CVV</small>
        <span>{cvv}</span>
      </div>
    </div>
  </div>
);

const PaymentMethod = ({ icon, title, amount, color }) => (
  <div className="payment-method" style={{ borderTop: `4px solid ${color}` }}>
    <button className="method-icon" style={{ backgroundColor: color }}>
      <img src={icon} alt={title} />
    </button>
    <h4>{title}</h4>
    <div className="divider"></div>
    <span className="amount">{amount}</span>
  </div>
);

const SavedCard = ({ icon, number, active = false }) => (
  <div className={`saved-card ${active ? 'active' : ''}`}>
    <div className="card-info">
      <img src={icon} alt="Card" className="card-type-icon" />
      <span>{number}</span>
      <img 
        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/luyjsx96_expires_30_days.png" 
        alt="Options" 
        className="card-menu-icon"
      />
    </div>
    <div className="card-divider"></div>
  </div>
);

const InfoCard = ({ name, company, email, vat, deleteIcon, editIcon }) => (
  <div className="info-card">
    <div className="card-header">
      <span>{name}</span>
      <div className="actions">
        <button className="delete-btn">
          <img src={deleteIcon} alt="Delete" />
          <span>DELETE</span>
        </button>
        <button className="edit-btn">
          <img src={editIcon} alt="Edit" />
          <span>EDIT</span>
        </button>
      </div>
    </div>
    <div className="card-content">
      <p>Company Name: {company}</p>
      <p>Email Address: {email}</p>
      <p>VAT Number: {vat}</p>
    </div>
  </div>
);

const InvoiceItem = ({ date, id, amount, pdfIcon }) => (
  <div className="invoice-item">
    <div className="invoice-info">
      <span className="date">{date}</span>
      <span className="id">{id}</span>
    </div>
    <div className="divider"></div>
    <div className="invoice-actions">
      <span className="amount">{amount}</span>
      <button className="pdf-btn">
        <img src={pdfIcon} alt="PDF" />
        <span>PDF</span>
      </button>
    </div>
  </div>
);

const Transaction = ({ icon, name, date, amount, type }) => (
  <div className="transaction">
    <img src={icon} alt={name} className="transaction-icon" />
    <div className="transaction-info">
      <span className="name">{name}</span>
      <span className="date">{date}</span>
    </div>
    <div className="divider"></div>
    <span className={`amount ${type}`}>{amount}</span>
  </div>
);