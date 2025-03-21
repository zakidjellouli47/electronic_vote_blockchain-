import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import AuthForm from "@/components/AuthForm";
import { toast } from "@/components/ui/use-toast";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  
  const handleRegister = (data) => {
    setLoading(true);
    setServerError(null);
    
    // Simulate registration API call
    setTimeout(() => {
      setLoading(false);
      
      // For demo purposes, allow registration with any valid data
      // In a real app, this would create an account on your backend
      if (data.email && data.password && data.password === data.confirmPassword) {
        toast({
          title: "Account created successfully",
          description: "You can now sign in with your credentials",
        });
        navigate("/login");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }, 1500);
  };
  
  return (
    <AuthLayout 
      title="Create an Account" 
      subtitle="Sign up to start using the voting platform"
    >
      <AuthForm 
        type="register"
        onSubmit={handleRegister}
        loading={loading}
        serverError={serverError}
      />
      
      <div className="mt-6 text-center text-sm text-white/70">
        <span>Already have an account?</span>{" "}
        <Link 
          to="/login" 
          className="text-white font-medium hover:text-pink-300 transition-all"
        >
          Sign in instead
        </Link>
      </div>
    </AuthLayout>
  );
};

export default Register;