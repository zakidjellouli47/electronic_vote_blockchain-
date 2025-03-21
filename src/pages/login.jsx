import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../auth/authlayout.jsx";
import AuthForm from "../auth/authform.jsx";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  
  const handleLogin = (data) => {
    setLoading(true);
    setServerError(null);
    
    // Simulate login API call
    setTimeout(() => {
      setLoading(false);
      
      // For demo purposes, allow login with any credentials
      // In a real app, this would validate against your backend
      if (data.email && data.password) {
        toast({
          title: "Successfully signed in",
          description: "Welcome back!",
        });
        navigate("/");
      } else {
        setServerError("Invalid email or password");
      }
    }, 1500);
  };
  
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to access your voting account"
    >
      <AuthForm 
        type="login"
        onSubmit={handleLogin}
        loading={loading}
        serverError={serverError}
      />
      
      <div className="mt-6 text-center text-sm text-white/70">
        <span>Don't have an account?</span>{" "}
        <Link 
          to="/register" 
          className="text-white font-medium hover:text-pink-300 transition-all"
        >
          Create one now
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Login;
