import { useState, useEffect } from "react";

const AuthLayout = ({ children, title, subtitle }) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 p-4 md:p-8 overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-[10%] left-[15%] w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute top-[20%] right-[20%] w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[15%] left-[35%] w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000" />
      </div>
      
      <div 
        className={`w-full max-w-md transition-all duration-700 relative z-10 ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="glass-card rounded-2xl p-8 md:p-10 backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-medium text-white mb-2 animate-slide-down">
              {title}
            </h1>
            <p className="text-white/80 animate-slide-down animate-delay-100">
              {subtitle}
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
