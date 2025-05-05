import { auth } from "../config/firebaseConfig";
import axios from "axios";

export async function sendTokenToBackend(idToken) {
  return fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`, // ✅ send the Firebase token here
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`Backend login failed with status ${res.status}`);
    }
    return res.json();
  });
}

// Fetches card data from the backend using Firebase token
export async function fetchCardData(idToken) {
  const response = await fetch("/api/cards", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fetching card data failed with status ${response.status}`);
  }

  return response.json();
}
