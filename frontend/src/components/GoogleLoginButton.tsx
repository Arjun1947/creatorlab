import { supabase } from "../lib/supabaseClient";

export default function GoogleLoginButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // after login user comes back to your website
      },
    });

    if (error) {
      console.error("Google login error:", error.message);
      alert(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      style={{
        padding: "10px 14px",
        borderRadius: "10px",
        border: "1px solid #ddd",
        cursor: "pointer",
      }}
    >
      Continue with Google
    </button>
  );
}
