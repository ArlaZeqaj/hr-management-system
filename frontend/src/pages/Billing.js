import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./Admin/AdminSidebar";
import AdminHeader from "./Admin/AdminHeader";
import AdminFooter from "./Admin/AdminFooter";
import "../styles/Billing.css";
import "./Admin/AdminSidebar.css";
import "./Admin/AdminHeader.css";
import "./Admin/AdminFooter.css";
import axios from "axios";
import { auth } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { collection, getDocs, getDoc } from "firebase/firestore";
//import { db } from "../firebaseConfig";

export default () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cardData, setCardData] = useState({});
  const [activeMenuItem, setActiveMenuItem] = useState(getActiveMenuItem());
  const [showModal, setShowModal] = useState(false);
  const [notifications, setNotifications] = useState({
    "New employee registrations": true,
    "Leave request approvals": true,
    "System alerts": true,
    "Payroll processing": false,
    "Performance reviews": false,
    "Company announcements": true,
    "Security alerts": true,
    "Data export completions": false,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [cardForm, setCardForm] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSaveCard = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    try {
      const user = auth.currentUser;
      if (!user) {
        console.error("User not authenticated");
        return;
      }

      // Validate card number (16 digits)
      if (!/^\d{16}$/.test(cardForm.number)) {
        setMessage("Please enter a valid 16-digit card number");
        setMessageType("error");
        return;
      }

      // Validate expiry date format (MM/YY) and future date
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(cardForm.expiry)) {
        setMessage("Please enter a valid expiry date (MM/YY)");
        setMessageType("error");
        return;
      }

      // Check if expiry date is in the future
      const [month, year] = cardForm.expiry.split('/');
      const expiryDate = new Date(`20${year}`, month - 1); // Convert to Date object
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Compare just dates

      if (expiryDate < currentDate) {
        setMessage("Card has expired. Please use a valid expiry date");
        setMessageType("error");
        return;
      }

      // Validate CVV (3 or 4 digits)
      if (!/^\d{3,4}$/.test(cardForm.cvv)) {
        setMessage("Please enter a valid CVV (3-4 digits)");
        setMessageType("error");
        return;
      }

      const cardRef = doc(db, "cards", user.uid);
      await setDoc(cardRef, {
        number: cardForm.number,
        expiry: cardForm.expiry,
        cvv: cardForm.cvv,
      });

      console.log("✅ Card saved successfully!");
      setMessage("Card saved successfully!");
      setMessageType("success");
      //setShowModal(false);
    } catch (error) {
      console.error("❌ Error saving card:", error);
      setMessage("Failed to save card. Check permissions and try again.");
      setMessageType("error");
    }
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  function getActiveMenuItem() {
    const path = location.pathname;
    if (path.includes("/admin/dashboard")) return "Dashboard";
    if (path.includes("/admin/profile")) return "Profile";
    if (path.includes("/new-hires")) return "New Hires";
    if (path.includes("/employee")) return "Employees";
    if (path.includes("/billing")) return "Billing";
    if (path.includes("/admin/projects")) return "Projects";
    return "Dashboard"; // default
  }

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    const routes = {
      Dashboard: "/admin/dashboard",
      Profile: "/admin/profile",
      "New Hires": "/new-hires",
      Employees: "/employee",
      Billing: "/billing",
      Projects: "/admin/projects",
    };
    navigate(routes[menuItem] || "/admin/dashboard");
  };

  {/* SHOW ADD NEW CARD MODAL */ }
  useEffect(() => {
    if (showModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showModal]);

  // Theme init
  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // ✅ FETCH CARD DATA USING FIREBASE TOKEN
  useEffect(() => {
    const fetchCardData = async (user) => {
      try {
        console.log("📢 User available:", user);
        if (!user) {
          console.error("❌ No user authenticated.");
          return;
        }

        const token = await user.getIdToken();
        console.log("📢 Firebase token:", token);

        const response = await axios.get("http://localhost:8080/api/cards", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📢 Card data received:", response.data);
        setCardData(response.data || {});
      } catch (error) {
        console.error("❌ Error fetching card data:", error);
        if (error.response) {
          console.error(
            "❌ Server responded with:",
            error.response.status,
            error.response.data
          );
        }
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👀 Auth state changed:", user);
      fetchCardData(user);
    });

    return () => unsubscribe();
  }, []);

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      const isAdmin = idTokenResult.claims.admin === true;

      console.log("User is admin");
    } else {
      console.log("User is not admin");
    }
  });

  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        const billingInfoSnapshot = await getDocs(
          collection(db, "BillingInfo")
        );
        const data = [];

        for (const docSnap of billingInfoSnapshot.docs) {
          const employeeId = docSnap.id;
          const accNo = docSnap.data().accNo;

          const employeeRef = doc(db, "employees", employeeId);
          const employeeSnap = await getDoc(employeeRef);

          if (employeeSnap.exists()) {
            const emp = employeeSnap.data();
            data.push({
              id: employeeId,
              name: emp.name,
              surname: emp.surname,
              department: emp.department,
              email: emp.email,
              accNo,
            });
            console.log("Fetched billing info: ", emp);
          }
        }

        setBillingData(data);
      } catch (error) {
        console.error("Error fetching billing info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBillingData();
  }, []);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const toggleNotification = (notification) => {
    setNotifications((prev) => ({
      ...prev,
      [notification]: !prev[notification],
    }));
  };

  return (
    <div className="app-container-b">
      <AdminSidebar
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
      />
      <div className="main-content-b">
        <AdminHeader
          activeMenuItem={activeMenuItem}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          toggleNotification={toggleNotification}
        />

        {/* Payment Cards */}

        <div className="card-row">
          <PaymentCard
            logo="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/4a0s3ehi_expires_30_days.png"
            number={cardData.number}
            expiry={cardData.expiry}
            cvv={cardData.cvv}
          />
          <PaymentMethod
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/vxv57pzf_expires_30_days.png"
            title="Balance"
            amount={`+${cardData.salary || "$0.00"}`}
            color="#4318FF"
          />
          <PaymentMethod
            icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/358903cd_expires_30_days.png"
            title="Paypal"
            amount={cardData.paypal || "$0.00"}
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
                <button
                  className="add-card-btn"
                  onClick={() => document.getElementById('billing-card-modal').showModal()}
                >
                  ADD A NEW CARD
                </button>
              </div>

              <div className="cards-list">
                <SavedCard
                  icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/lyn2slbm_expires_30_days.png"
                  number={cardData.number}
                  active
                />
                <SavedCard
                  icon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/8rtvtp5o_expires_30_days.png"
                  number={cardData.number}
                />
              </div>
            </section>
            {/* ADD NEW CARD MODAL */}
            <dialog id="billing-card-modal" className="billing-modal">
              <div className="billing-modal-content">
                <div className="billing-modal-header">
                  <h3>Add Payment Method</h3>
                  <button
                    className="billing-modal-close"
                    onClick={() => document.getElementById('billing-card-modal').close()}
                  >
                    &times;
                  </button>
                </div>

                {/* Card Preview */}
                <div className="billing-card-preview">
                  <div className="billing-card-preview-header">
                    <span className="billing-card-company">HRCloudX</span>
                    <div className="billing-card-type-logo">
                      <img
                        src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/lyn2slbm_expires_30_days.png"
                        alt="Mastercard"
                        width="40"
                      />
                    </div>
                  </div>
                  <div className="billing-card-number">
                    {cardForm.number ? (
                      cardForm.number.replace(/(\d{4})/g, '$1 ').trim()
                    ) : '•••• •••• •••• ••••'}
                  </div>
                  <div className="billing-card-footer">
                    <div className="billing-card-detail">
                      <span className="billing-detail-label">Expires</span>
                      <span className="billing-detail-value">{cardForm.expiry || '••/••'}</span>
                    </div>
                    <div className="billing-card-detail">
                      <span className="billing-detail-label">CVV</span>
                      <span className="billing-detail-value">{cardForm.cvv ? '•••' : '•••'}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSaveCard} className="billing-card-form">
                  <div className="billing-form-group floating">
                    <input
                      type="text"
                      id="cardNumber"
                      placeholder=" "
                      value={cardForm.number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').substring(0, 16);
                        setCardForm({ ...cardForm, number: value });
                      }}
                      maxLength="19"
                      required
                    />
                    <label htmlFor="cardNumber">Card Number</label>
                    <div className="billing-card-icons">
                      <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/4a0s3ehi_expires_30_days.png" alt="Visa" width="40" />
                      <img src="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/lyn2slbm_expires_30_days.png" alt="Mastercard" width="40" />
                    </div>
                  </div>

                  <div className="billing-form-row">
                    <div className="billing-form-group floating">
                      <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardForm.expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');

                          // Auto-insert slash after 2 digits
                          if (value.length > 2) {
                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                          }

                          // Validate month (01-12)
                          if (value.length >= 2) {
                            const month = parseInt(value.substring(0, 2), 10);
                            if (month < 1 || month > 12) {
                              // Invalid month - don't update
                              return;
                            }
                          }

                          // Limit to MM/YY format (5 chars max)
                          setCardForm({ ...cardForm, expiry: value.substring(0, 5) });
                        }}
                        maxLength="5"
                        pattern="(0[1-9]|1[0-2])\/\d{2}"
                        required
                      />
                      <label htmlFor="expiry">Expiry Date</label>
                    </div>

                    <div className="billing-form-group floating">
                      <div className="billing-input-with-icon">
                        <input
                          type="password"
                          id="cvv"
                          placeholder=" "
                          value={cardForm.cvv}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').substring(0, 3);
                            setCardForm({ ...cardForm, cvv: value });
                          }}
                          maxLength="3"
                          required
                        />
                        <label htmlFor="cvv">Security Code</label>
                        <button
                          type="button"
                          className="billing-info-icon"
                          aria-label="What is CVV?"
                          title="3-digit code on back of card"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className={`billing-form-message ${messageType}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24">
                        {messageType === 'success' ? (
                          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        ) : (
                          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                        )}
                      </svg>
                      <span>{message}</span>
                    </div>
                  )}

                  <div className="billing-form-actions">
                    <button
                      type="button"
                      className="billing-secondary-btn"
                      onClick={() => document.getElementById('billing-card-modal').close()}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="billing-primary-btn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Save Card
                    </button>
                  </div>
                </form>
              </div>
            </dialog>

            {/* Billing Information */}
            <section className="billing-info">
              <h3>Billing Information</h3>

              <div className="info-cards">
                {loading ? (
                  <p>Loading billing info...</p>
                ) : billingData.length === 0 ? (
                  <p>No billing information found.</p>
                ) : (
                  billingData.map((emp) => (
                    <InfoCard
                      key={emp.id}
                      name={`${emp.name} ${emp.surname}`}
                      company={emp.department}
                      email={emp.email}
                      vat={emp.accNo}
                      deleteIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/136x2u2r_expires_30_days.png"
                      editIcon="https://storage.googleapis.com/tagjs-prod.appspot.com/v1/Hvb8f3Xbra/7otne8qi_expires_30_days.png"
                    />
                  ))
                )}
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

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};

// Reusable Components (same as before)
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
      <p>Department: {company}</p>
      <p>Email Address: {email}</p>
      <p>IBAN: {vat}</p>
    </div>
  </div>
);

const SavedCard = ({ icon, number, active = false }) => (
  <div className={`saved-card ${active ? "active" : ""}`}>
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
