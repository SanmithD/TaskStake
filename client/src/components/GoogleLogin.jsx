import axios from "axios";
import { useEffect, useRef } from "react";

function GoogleLogin({ onLogin }) {
  const googleButtonRef = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeGoogle = () => {
      if (!window.google || isInitialized.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(
            googleButtonRef.current,
            { 
              theme: "outline", 
              size: "large",
              type: "standard",
              shape: "rectangular",
              logo_alignment: "left"
            }
          );
        }

        isInitialized.current = true;
      } catch (error) {
        console.error('Google initialization error:', error);
      }
    };

    const handleGoogleResponse = async (response) => {
      try {
        const res = await axios.post(
          "http://localhost:7000/api/auth/google",
          { credential: response.credential },
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
        
        if (res.data.success) {
          onLogin?.(res.data.data.user);
        }
      } catch (error) {
        console.error('Google login error:', error);
      }
    };

    // Load Google script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    } else {
      initializeGoogle();
    }

    return () => {
      // Cleanup if needed
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [onLogin]);

  return <div ref={googleButtonRef} id="googleBtn"></div>;
}

export default GoogleLogin;
