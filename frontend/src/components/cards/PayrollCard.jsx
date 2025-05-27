import React, { useEffect, useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const PayrollCard = () => {
  const [amount, setAmount] = useState(null);
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayroll = async (user) => {
      try {
        console.log("📢 User available:", user);
        if (!user) {
          console.error("❌ No user authenticated.");
          setAmount(0);
          setLoading(false);
          return;
        }

        const token = await user.getIdToken();
        console.log("📢 Firebase token:", token);

        const response = await axios.get("http://localhost:8080/api/payroll", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📢 Payroll API response:", response);

        setAmount(response.data.netSalary || 0);
        setMonth(response.data.month || "");
      } catch (error) {
        console.error("❌ Error fetching payroll:", error);
        if (error.response) {
          console.error(
            "❌ Server responded with:",
            error.response.status,
            error.response.data
          );
        }
        setAmount(0);
      } finally {
        setLoading(false);
        console.log("✅ Finished payroll fetch");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("👀 Auth state changed:", user);
      fetchPayroll(user);
    });

    // Cleanup subscription when component unmounts
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="payroll-card-z">Loading payroll...</div>;
  }

  return (
    <div className="payroll-card-z">
      <div className="payroll-bg-circle-z top-right"></div>
      <div className="payroll-bg-circle-z bottom-left"></div>
      {/* <p className="payroll-label-z">Payroll for {month}</p>
            <p className="payroll-amount-z">${amount}</p> */}
      <p className="payroll-label-z">Payroll for May</p>
      <p className="payroll-amount-z">855</p>
      <a href="#" className="payroll-link-z">
        View details
      </a>
    </div>
  );
};

export default PayrollCard;
