// BirthdayContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const BirthdayContext = createContext();

export const BirthdayProvider = ({ children }) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const fetchEmployees = async () => {
   try {
     const auth = getAuth();
     const user = auth.currentUser;
     if (!user) {
       throw new Error('No authenticated user');
     }

     const token = await user.getIdToken();

     const response = await axios.get('/api/employees', {
       headers: {
         Authorization: `Bearer ${token}`,
       },
     });

     setAllEmployees(response.data);
     setError(null);
   } catch (err) {
     console.error('Error fetching employees:', err);
     setError(err);
     setAllEmployees([]);
   } finally {
     setLoading(false);
   }
 };


  useEffect(() => {
    fetchEmployees();
    const interval = setInterval(fetchEmployees, 3600000);
    return () => clearInterval(interval);
  }, []);

  const refreshEmployees = () => {
    setLoading(true);
    fetchEmployees();
  };

  return (
    <BirthdayContext.Provider value={{ allEmployees, loading, error, refreshEmployees }}>
      {children}
    </BirthdayContext.Provider>
  );
};

export const useBirthdays = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error('useBirthdays must be used within a BirthdayProvider');
  }
  return context;
};
