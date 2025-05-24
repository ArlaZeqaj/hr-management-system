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
import { updateDoc } from "firebase/firestore";
import jsPDF from "jspdf";
import { query, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import AddCardModal from "../components/modals/AddCardModal";
import PaymentMethodsSection from "../components/sections/PaymentMethodsSection";
import PaymentCardsSection from "../components/sections/PaymentCardsSection";
import BillingInfoSection from "../components/sections/BillingInfoSection";
import InvoicesSection from "../components/sections/InvoicesSection";
import TransactionsSection from "../components/sections/TransactionsSection";

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
      const [month, year] = cardForm.expiry.split("/");
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

  {
    /* SHOW ADD NEW CARD MODAL */
  }
  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
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

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const idTokenResult = await firebaseUser.getIdTokenResult();
        const isAdmin = idTokenResult.claims.admin === true;
        console.log("User is admin:", isAdmin);
      } else {
        console.log("User is not authenticated");
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchBillingData = async () => {
    try {
      const billingInfoSnapshot = await getDocs(collection(db, "BillingInfo"));
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

  useEffect(() => {
    fetchBillingData();
  }, []);

  // edit acc no
  const [editingId, setEditingId] = useState(null);
  const [editAccNo, setEditAccNo] = useState("");

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditAccNo(emp.accNo || "");
  };

  const handleSave = async (id) => {
    try {
      await updateDoc(doc(db, "BillingInfo", id), { accNo: editAccNo });
      setEditingId(null);
      fetchBillingData(); // Refresh
    } catch (error) {
      console.error("Error saving accNo:", error);
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const toggleNotification = (notification) => {
    setNotifications((prev) => ({
      ...prev,
      [notification]: !prev[notification],
    }));
  };

  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Invoices"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setInvoices(data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("HRCloudX", 20, 10);
    doc.text("Invoice", 20, 20);

    doc.setFontSize(12);
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 20, 40);
    doc.text(`Date: ${invoice.date}`, 20, 50);
    doc.text(`Amount: $${invoice.amount}`, 20, 60);
    doc.text(
      `This invoice is generated automatically and will not be signed
    `,
      20,
      120
    );

    doc.save(`${invoice.invoiceNumber}.pdf`);
  };

  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const q = query(collection(db, "Transactions"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(), // Convert Firestore Timestamp to JS Date
    }));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDateGroup = (date) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return format(date, "dd MMMM yyyy");
  };

  const grouped = transactions.reduce((acc, txn) => {
    const label = formatDateGroup(txn.date);
    acc[label] = acc[label] || [];
    acc[label].push(txn);
    return acc;
  }, {});

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
        <PaymentCardsSection cardData={cardData} />

        {/* Combined Content Area */}
        <div className="combined-content">
          {/* Left Column */}
          <div className="content-column">
            {/* Payment Methods Section */}
            <PaymentMethodsSection
              cardData={cardData}
              setShowModal={setShowModal}
              cardForm={cardForm}
              setCardForm={setCardForm}
              handleSaveCard={handleSaveCard}
              message={message}
              messageType={messageType}
            />
            <AddCardModal
              showModal={showModal}
              setShowModal={setShowModal}
              cardForm={cardForm}
              setCardForm={setCardForm}
              handleSaveCard={handleSaveCard}
              message={message}
              messageType={messageType}
            />
            {/* Billing Information */}
            <BillingInfoSection
              billingData={billingData}
              loading={loading}
              editingId={editingId}
              editAccNo={editAccNo}
              handleEdit={handleEdit}
              handleSave={handleSave}
              setEditAccNo={setEditAccNo}
            />
          </div>

          {/* Right Column (former sidebar content) */}
          <div className="content-column">
            {/* Invoices Section */}
            <InvoicesSection
              invoices={invoices}
              generateInvoicePDF={generateInvoicePDF}
            />

            {/* Transactions Section */}
            <TransactionsSection
              groupedTransactions={grouped}
              formatDateGroup={formatDateGroup}
            />
          </div>
        </div>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
};
