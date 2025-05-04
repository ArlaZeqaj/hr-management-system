import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const BirthdayContext = createContext();
const BIRTHDAY_CACHE_KEY = 'birthday-data';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

export const BirthdayProvider = ({ children }) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  const fetchEmployees = useCallback(async (user) => {
    try {
      // Check cache first
      const cachedData = localStorage.getItem(BIRTHDAY_CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          setAllEmployees(data);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      const token = await user.getIdToken();

      const response = await axios.get('/api/employees', {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 5000
      });

      // Cache the response
      localStorage.setItem(BIRTHDAY_CACHE_KEY, JSON.stringify({
        data: response.data,
        timestamp: Date.now()
      }));

      setAllEmployees(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Failed to fetch employees');


      const cachedData = localStorage.getItem(BIRTHDAY_CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setAllEmployees(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth state listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthInitialized(true);
      if (user) {
        fetchEmployees(user).catch(err => {
          console.error('Error in initial employee fetch:', err);
          setError(err.message);
        });
      } else {
        setAllEmployees([]);
        setError('No authenticated user');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchEmployees]);


  useEffect(() => {
    if (!authInitialized) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const interval = setInterval(() => {
      fetchEmployees(user).catch(err => {
        console.error('Error in interval employee fetch:', err);
      });
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [authInitialized, fetchEmployees]);

  const refreshEmployees = useCallback(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError('No authenticated user');
      return Promise.resolve();
    }


    localStorage.removeItem(BIRTHDAY_CACHE_KEY);
    return fetchEmployees(user);
  }, [fetchEmployees]);

  return (
    <BirthdayContext.Provider value={{
      allEmployees,
      loading,
      error,
      refreshEmployees
    }}>
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