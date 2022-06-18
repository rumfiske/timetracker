import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { supabase } from "../utils/SupabaseClient";

function Header() {
  const router = useRouter();
  const [userData, setuserData] = useState(null);
  const [firstChatUsername, setfirstChatUsername] = useState("");
  async function logout() {
    const { error } = await supabase.auth.signOut();

    redirectUser();
  }

  function redirectUser() {
    router.push("/");
  }

  async function getLoggedinUser() {
    const user = supabase.auth.user();
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.log(error);
    }

    if (data) {
      setuserData(data);
      setfirstChatUsername(data.username);
    }
  }

  useEffect(() => {
    getLoggedinUser();
  }, []);

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <a className="btn btn-ghost normal-case text-xl">itoperators</a>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex="0" className="btn  btn-circle btn-primary avatar">
            <div className="w-10 rounded-full">
              <span className="text-3xl">{firstChatUsername?.slice(0, 1)}</span>
            </div>
          </label>
          <ul
            tabIndex="0"
            className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={(e) => logout()}>Log ud</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
