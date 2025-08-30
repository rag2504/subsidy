import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { authHeader, clearToken, getRole, setToken, getToken } from "@/lib/auth";
import { apiUrl } from "@/lib/api";

// Static credentials for restricted roles
const STATIC_CREDENTIALS = {
  gov: { email: "gov@subsidy.gov", password: "gov-secure-2024" },
  auditor: { email: "auditor@subsidy.gov", password: "audit-secure-2024" },
  bank: { email: "bank@subsidy.gov", password: "bank-secure-2024" }
};

// Check if role requires static credentials
const isRestrictedRole = (role: string) => {
  return ["gov", "auditor", "bank"].includes(role);
};

export default function AuthGate({
  requiredRole,
  children,
}: {
  requiredRole: string;
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const role = getRole();
  const token = getToken();

  // Check if token is valid by making a test API call
  useEffect(() => {
    if (token) {
      fetch(apiUrl("/api/auth/me"), {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.ok) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          clearToken(); // Clear invalid token
        }
      })
      .catch(() => {
        setIsValidToken(false);
        clearToken(); // Clear invalid token
      });
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  // Show loading while checking token validity
  if (isValidToken === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">Checking authentication...</div>
      </div>
    );
  }

  if (token && isValidToken && role === requiredRole) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border bg-card p-3 text-sm text-muted-foreground flex items-center justify-between">
          <span>
            Signed in as <span className="font-medium">{role}</span> •{" "}
            {email || "session"}
          </span>
          <Button
            variant="secondary"
            onClick={() => {
              clearToken();
              location.reload();
            }}
          >
            Sign out
          </Button>
        </div>
        {children}
      </div>
    );
  }

  // Static credentials form for restricted roles
  if (isRestrictedRole(requiredRole)) {
    return (
      <section className="rounded-xl border bg-card p-6 shadow-sm max-w-md mx-auto">
        <h2 className="font-semibold text-center mb-6">Access Restricted Area</h2>
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-sm text-amber-800">
            <strong>⚠️ Restricted Access:</strong> This area requires authorized credentials.
          </p>
        </div>
        
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setStatus(null);
            
            const credentials = STATIC_CREDENTIALS[requiredRole as keyof typeof STATIC_CREDENTIALS];
            
            if (email === credentials.email && password === credentials.password) {
              // Use server-side static login
              const r = await fetch(apiUrl("/api/auth/static-login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, role: requiredRole }),
              });
              const data = await r.json();
              
              if (r.ok && data.token) {
                setToken(data.token);
                setStatus("Access granted");
                location.reload();
              } else {
                setStatus("Invalid credentials");
              }
            } else {
              setStatus("Invalid credentials");
            }
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter authorized email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 text-sm"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full">
            Access {requiredRole.toUpperCase()} Dashboard
          </Button>
        </form>
        
        {status && (
          <div className={`mt-3 text-sm p-2 rounded-md ${
            status === "Access granted" 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {status}
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground text-center">
          This area is restricted to authorized personnel only.
        </div>
      </section>
    );
  }

  // OTP-based authentication for producers
  return (
    <section className="rounded-xl border bg-card p-6 shadow-sm max-w-md mx-auto">
      <h2 className="font-semibold text-center mb-6">Producer Authentication</h2>
      
      {!showOtpForm ? (
        // Initial sign up/login form
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Welcome to the Producer Portal. Please sign in or create an account to continue.
            </p>
          </div>
          
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email) {
                setStatus("Please enter your email address");
                return;
              }
              
              setStatus(null);
              const r = await fetch(apiUrl("/api/auth/request-otp"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
              });
              const data = await r.json().catch(() => ({}));
              
              if (r.ok) {
                setShowOtpForm(true);
                setStatus(
                  data.devOtp
                    ? `OTP sent (Dev OTP: ${data.devOtp})`
                    : "OTP sent to your email",
                );
                if (data.devOtp) setOtp(data.devOtp);
              } else {
                setStatus("Failed to send OTP. Please try again.");
              }
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Email Address</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Continue with Email
            </Button>
          </form>
        </div>
      ) : (
        // OTP verification form
        <div className="space-y-4">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              We've sent a verification code to <strong>{email}</strong>
            </p>
            <button
              className="text-blue-600 underline text-sm mt-2"
              onClick={() => setShowOtpForm(false)}
            >
              Use different email
            </button>
          </div>
          
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus(null);
              
              const r = await fetch(apiUrl("/api/auth/verify-otp"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, role: requiredRole }),
              });
              const data = await r.json().catch(() => null);
              
              if (data?.token) {
                setToken(data.token);
                setStatus("Successfully signed in!");
                setTimeout(() => location.reload(), 1000);
              } else {
                setStatus("Invalid OTP. Please try again.");
              }
            }}
          >
            <div>
              <label className="block text-sm font-medium mb-1">Verification Code</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm text-center text-lg tracking-widest"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            
            <Button type="submit" className="w-full">
              Verify & Sign In
            </Button>
          </form>
          
          <div className="text-center">
            <button
              className="text-blue-600 underline text-sm"
              onClick={async () => {
                setStatus(null);
                const r = await fetch(apiUrl("/api/auth/request-otp"), {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email }),
                });
                const data = await r.json().catch(() => ({}));
                
                if (r.ok) {
                  setStatus("New OTP sent");
                  if (data.devOtp) setOtp(data.devOtp);
                } else {
                  setStatus("Failed to resend OTP");
                }
              }}
            >
              Resend code
            </button>
          </div>
        </div>
      )}
      
      {status && (
        <div className={`mt-3 text-sm p-2 rounded-md ${
          status.includes("Successfully") || status.includes("sent")
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status}
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground text-center">
        Secure authentication via email OTP. Your data is protected.
      </div>
    </section>
  );
}

export function withAuthHeaders(init?: RequestInit): RequestInit {
  return {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...authHeader(),
      ...(init?.headers as any),
    },
  };
}
