
// =============================
// Register Page Code
// =============================
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsLoading(true);
    // Save new user to localStorage (for demo only)
    const usersRaw = localStorage.getItem("expense-tracker-users");
    let users = usersRaw ? JSON.parse(usersRaw) : [];
    if (users.find((u: any) => u.email === email)) {
      alert("Email already registered. Please login.");
      setIsLoading(false);
      return;
    }
    const newUser = { email, name, password };
    users.push(newUser);
    localStorage.setItem("expense-tracker-users", JSON.stringify(users));
    alert("Registration successful! Please login.");
    setIsLoading(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-4">Create Account</h2>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </form>
    </div>
  );
}
