import Link from "next/link";
import { useState } from "react";
import { supabase } from "../utils/SupabaseClient";

export default function opret() {
  const [brugernavn, setbrugernavn] = useState("");
  const [password, setpassword] = useState("");
  const [email, setemail] = useState("");
  const [signedUp, setsignedUp] = useState(false);
  const [errorMsg, seterrorMsg] = useState("");
  async function handleSubmit(brugernavn, email) {
    const { user, session, error } = await supabase.auth.signUp(
      {
        email: email,
        password: password,
      },
      {
        data: {
          email: email,
          brugernavn: brugernavn,
        },
      }
    );
    console.log(email, brugernavn, password);
    if (error) {
      console.log(error);
      seterrorMsg(error.message);
    } else {
      seterrorMsg(null);
      setsignedUp(true);
    }
  }

  return (
    <>
      <div className="min-h-full flex">
        <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 h-screen w-2/4  ">
          <h1 className="text-6xl mb-32 text-center">
            Itoperators - Tidsregistrering
          </h1>
          <span className="text-red-500 py-4 font-bold">{errorMsg}</span>
          {!signedUp ? (
            <>
              <div className="form-control  grid gap-5 grid-cols-2 w-full  place-content-between">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="E-Mail"
                  className="input mr-2 w-full col-span-2  input-primary text-gray-300 placeholder:text-gray-300 !outline-none"
                />
                <input
                  type="text"
                  value={brugernavn}
                  onChange={(e) => setbrugernavn(e.target.value)}
                  placeholder="Brugernavn"
                  className="input mr-2 w-full max-w-md input-primary text-gray-300 placeholder:text-gray-300 !outline-none"
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
                className="btn w-48 mx-auto my-4 bg-primary text-gray-200 border-0"
                onClick={() => handleSubmit(brugernavn, email)}
              >
                Opret konto
              </button>
            </>
          ) : (
            <h1 className="text-center">
              Tak for din oprretelse, tjek din email for at bekræfte din konto
            </h1>
          )}
          <h3 className="text-center">
            <span className="text-indigo-400 font-bold">
              <Link href="/">Tilbage</Link>
            </span>
          </h3>
        </div>
        <div className="hidden lg:block relative w-0 flex-1">
          <img
            className="absolute inset-0 h-full w-full object-cover "
            src="images/forside-slider.jpg"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
