import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import logo from "../assets/logo.svg";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isLogin) {
      // Handle login
      console.log("Login attempt with:", formData.email);
      toast.success("Login successful!");
      navigate("/dashboard");
    } else {
      // Handle registration
      console.log("Registration attempt with:", formData);
      toast.success("Registration successful! You can now login");
      setIsLogin(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl overflow-hidden shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="VoteGuard Logo" className="h-16 w-16 mb-4" />
            <h1 className="text-2xl font-bold text-gray-800">VoteGuard</h1>
            <p className="text-gray-500 text-sm mt-1">Secure Voting Platform</p>
          </div>

          <div className="flex mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 text-center py-2 ${
                isLogin ? "auth-tabs-active" : "auth-tabs-inactive"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 text-center py-2 ${
                !isLogin ? "auth-tabs-active" : "auth-tabs-inactive"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <Label htmlFor="name">Full Name</Label>
                <div className="form-input-wrapper">
                  <Input
                    id="name"
                    name="name"
                    className="form-input pl-10"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  <User className="form-input-icon absolute left-3" size={18} />
                </div>
              </div>
            )}

            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <div className="form-input-wrapper">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <Mail className="form-input-icon absolute left-3" size={18} />
              </div>
            </div>

            <div className="mb-6">
              <Label htmlFor="password">Password</Label>
              <div className="form-input-wrapper">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input pl-10"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Lock className="form-input-icon absolute left-3" size={18} />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 mt-2">
              {isLogin ? "Sign In" : "Sign Up"}
              <ArrowRight size={18} />
            </Button>

            {isLogin && (
              <p className="text-center mt-4 text-sm text-gray-500">
                <a href="#" className="text-vote hover:underline">
                  Forgot your password?
                </a>
              </p>
            )}

            <div className="flex items-center my-6">
              <Separator className="flex-1" />
              <span className="px-3 text-xs text-gray-400 uppercase">or</span>
              <Separator className="flex-1" />
            </div>

            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={toggleView}
                className="text-vote font-medium hover:underline"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
