"use client";

import 'react-toastify/dist/ReactToastify.css';

import { useState } from 'react';

import {
  ChevronLeft,
  ClipboardCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  toast,
  ToastContainer,
} from 'react-toastify';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form data for both login and register
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Track which tab is active: "login" or "register"
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Toggle states for showing/hiding password in each form
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const { email, password, name } = formData;
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  // Generic onChange for all inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        toast.success("Login successful!");
        router.push("/");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        toast.success("Account created successfully!");
        router.push("/");
      } else {
        let errorMsg = data.message || "Registration failed";
        
        if (data.errors) {
          const firstKey = Object.keys(data.errors)[0];
          errorMsg = data.errors[firstKey]?.[0] || errorMsg;
        }
        
        toast.error(errorMsg);
      }
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Link
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center text-sm font-medium text-muted-foreground"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <ClipboardCheck className="mx-auto h-10 w-10" />
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            Please login or create an account
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(val) => {
            setActiveTab(val as "login" | "register");
            // Clear password visibility when switching tabs
            setShowLoginPassword(false);
            setShowRegisterPassword(false);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          {/* ----------- Login Tab ----------- */}
          <TabsContent value="login">
            <Card>
              <form onSubmit={handleLogin}>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your email and password to access your account
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[50%] translate-y-[-50%]"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* ----------- Register Tab ----------- */}
          <TabsContent value="register">
            <Card>
              <form onSubmit={handleRegister}>
                <CardHeader>
                  <CardTitle>Create an account</CardTitle>
                  <CardDescription>
                    Enter your information to create an account
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      required
                      value={name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      required
                      value={email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showRegisterPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[50%] translate-y-[-50%]"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Creating account..."
                      : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}