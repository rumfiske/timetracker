import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../utils/SupabaseClient";
import { useRouter } from "next/router";
export default function index() {
  const router = useRouter();
  const [errorMsg, seterrorMsg] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const user = supabase.auth.user();
  const [timer, settimer] = useState(3);
  const [isLoggedIn, setisLoggedIn] = useState(false);

  function redirect() {
    setInterval(() => {
      settimer(timer - 1);

      if (timer === 1) {
        router.push("/kontrolpanel");
      }
    }, 1000);
  }

  async function handleSignin(email, password) {
    const { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });

    if (error) {
      console.log(error);
      seterrorMsg(error.message);
    }

    if (user) {
      supabase.auth.setSession(session);
      setisLoggedIn(true);
      seterrorMsg(null);
    }
  }

  useEffect(() => {
    const user = supabase.auth.user();

    if (user) {
      setisLoggedIn(true);
    }
  }, []);

  return (
    <>
      <div className="min-h-full flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 h-screen w-2/4  ">
          <h1 className="text-6xl mb-32 text-center">
            Itoperators - Tidsregistrering
          </h1>
          <span className="text-red-500 py-4 font-bold">{errorMsg}</span>
          {!isLoggedIn ? (
            <>
              <div className="form-control flex flex-row items-center justify-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="E-Mail"
                  className="input mr-2 w-full col-span-2  input-primary text-gray-300 placeholder:text-gray-300 !outline-none"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  className="input w-full max-w-md input-primary text-gray-300 placeholder:text-gray-300 !outline-none"
                />
              </div>
              <button
                className="btn w-48 border-0 mx-auto my-4 bg-green-500 text-gray-200 hover:bg-green-600"
                onClick={(e) => handleSignin(email, password)}
              >
                Log ind
              </button>
              <h3 className="text-center">
                Har du ikke en konto? -{" "}
                <span className="text-indigo-400 font-bold">
                  <Link href="/opret">Opret dig her</Link>
                </span>
              </h3>
            </>
          ) : (
            <>
              <p className="text-center text-2xl">
                Du er logget ind med {user.email}
              </p>
              <p className="text-center text-lg">
                Du bliver viderstillet til admin siden om ... {timer}
              </p>
              {redirect()}
            </>
          )}
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="images/forside-slider.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
