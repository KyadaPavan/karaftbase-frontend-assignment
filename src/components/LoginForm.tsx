"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Copy } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/slices/authSlice";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const dispatch = useAppDispatch();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Password should have at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const copyToClipboard = async (text: string, type: "email" | "password") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "email") {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
        setEmail(text);
      } else {
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 2000);
        setPassword(text);
      }
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      newErrors.password =
        "Password must be at least 8 characters with uppercase, lowercase, number and special character";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      dispatch(login({ email, password }));

      // Check if login was successful
      if (email !== "pavan@gmail.com" || password !== "Pavan@16") {
        setErrors({ email: "Invalid credentials" });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Welcome Back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Sign in to access your Kanban board
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500 bg-white ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.email}
              </motion.p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500 bg-white ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.password}
              </motion.p>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Sign In
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          <p className="mb-3 text-gray-500">DEMO CREDENTIALS</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  EMAIL
                </p>
                <p className="font-medium text-gray-900">pavan@gmail.com</p>
              </div>
              <button
                onClick={() => copyToClipboard("pavan@gmail.com", "email")}
                className="p-2 hover:bg-gray-200 rounded-md transition-colors group"
                title="Copy email"
              >
                {copiedEmail ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-600"
                  >
                    ✓
                  </motion.div>
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  PASSWORD
                </p>
                <p className="font-medium text-gray-900">pavan@16</p>
              </div>
              <button
                onClick={() => copyToClipboard("Pavan@16", "password")}
                className="p-2 hover:bg-gray-200 rounded-md transition-colors group"
                title="Copy password"
              >
                {copiedPassword ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-green-600"
                  >
                    ✓
                  </motion.div>
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
