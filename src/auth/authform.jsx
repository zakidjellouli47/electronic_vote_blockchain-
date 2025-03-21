import { useState } from "react";
import { InputField } from "./InputField";
import { Button } from "./Button";

const AuthForm = ({ 
  type = "login", 
  onSubmit, 
  loading = false, 
  serverError = null 
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    // Confirm password validation (for registration)
    if (type === "register" && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {serverError && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-200 animate-fade-in">
          {serverError}
        </div>
      )}
      
      <div className="space-y-4">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="youremail@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          autoComplete="email"
          autoFocus
        />
        
        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder={type === "login" ? "Your password" : "Create a password"}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          autoComplete={type === "login" ? "current-password" : "new-password"}
        />
        
        {type === "register" && (
          <InputField
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            autoComplete="new-password"
          />
        )}
      </div>
      
      <Button 
        type="submit" 
        className="w-full transition-all" 
        loading={loading}
      >
        {type === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
};

export default AuthForm;
