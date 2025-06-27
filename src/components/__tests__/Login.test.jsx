jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => ({})),
  collection: jest.fn(() => ({})),
  getDocs: jest.fn(),
  getDoc: jest.fn(async () => ({
    exists: () => true, // or false, depending on what you want your test to do
  })),
  query: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("../../firebaseConfig", () => ({
  auth: {},
  db: {}, // Add this if your app imports db from firebaseConfig
}));

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

// Mock useNavigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

// Fully mock firebase/auth (no requireActual)
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  GithubAuthProvider: jest.fn(),
}));

const { auth } = require("../../firebaseConfig");

const mockNavigate = jest.fn();
const mockSignIn = signInWithEmailAndPassword;

beforeEach(() => {
  useNavigate.mockReturnValue(mockNavigate);
  mockSignIn.mockClear();
  mockNavigate.mockClear();
  mockSignIn.mockResolvedValue({ user: { uid: "dummy-uid" } });
});

test("renders login form and allows user to login with email and password", async () => {
  render(<Login />);
  fireEvent.change(screen.getByPlaceholderText(/email/i), {
    target: { value: "test@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { value: "password123" },
  });
  fireEvent.click(screen.getByText(/sign in with email/i));

  await waitFor(() => {
    expect(mockSignIn).toHaveBeenCalledWith(
      auth,
      "test@example.com",
      "password123"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});