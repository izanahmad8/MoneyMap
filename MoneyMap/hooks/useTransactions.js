import { useCallback, useState } from "react";
import { Alert } from "react-native";

const API_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const fetchTransaction = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/${userId}`);
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transaction:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/summary/${userId}`);
      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching Summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      //can be run in parallel
      await Promise.all([fetchTransaction(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchSummary, fetchTransaction, userId]);

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("failed to delete transaction");
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      console.error("Error deleting data", error);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
