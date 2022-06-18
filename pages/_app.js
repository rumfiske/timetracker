import "../styles/globals.css";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { supabase } from "../utils/SupabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  const [session, setSession] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <Component {...pageProps} session={session} />
    </>
  );
}

export default MyApp;
