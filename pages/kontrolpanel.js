import React, { useEffect } from "react";
import { supabase } from "../utils/SupabaseClient";
import DatePicker from "react-datepicker";
import { Combobox } from "@headlessui/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  CalendarIcon,
  ChartBarIcon,
  CheckIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  MenuIcon,
  SelectorIcon,
  UsersIcon,
  XIcon,
} from "@heroicons/react/outline";
import { PlusCircleIcon } from "@heroicons/react/solid";
import { IconDelete } from "@supabase/ui";

import { toast } from "react-toastify";
const navigation = [
  { name: "Kontrolpanel", href: "#", icon: HomeIcon, current: true },
  { name: "Medarbejdere", href: "#", icon: UsersIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Kontrolpanel({ session }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [timetrackData, setTimetrackData] = useState([]);
  const [medarbejdere, setMedarbejdere] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState();
  const [userData, setuserData] = useState(null);
  const [query, setQuery] = useState("");
  const [isDisabled, setisDisabled] = useState(true);
  const [q, setQ] = useState("");
  const [søgKunde, setSøgKunde] = useState("");
  const [kunde, setKunde] = useState("");
  const [søgVarrighed, setSøgVarrighed] = useState(null);
  const [kontaktPerson, setKontaktPerson] = useState("");
  const [varighed, setVarighed] = useState(0);
  const [beskrivelse, setBeskrivelse] = useState("");

  const user = supabase.auth.user();
  const router = useRouter();
  useEffect(() => {
    user ? console.log(user) : router.push("/");
  }, []);

  useEffect(() => {
    if (selectedPerson === null) {
      setisDisabled(true);
      return;
    } else if (varighed === 0) {
      setisDisabled(true);
      return;
    } else if (kunde.length <= 0) {
      setisDisabled(true);
      return;
    } else if (startDate.length <= 0) {
      setisDisabled(true);
      return;
    } else if (kontaktPerson.length <= 0) {
      setisDisabled(true);
      return;
    } else if (beskrivelse.length <= 0) {
      setisDisabled(true);
      return;
    } else {
      setisDisabled(false);
    }
  }, [startDate, selectedPerson, kunde, kontaktPerson, varighed, beskrivelse]);

  //Hent data fra Supabase på bruger som er logget ind
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
    }
  }

  useEffect(() => {
    getLoggedinUser();
  }, []);

  //Hent liste over alle brugere
  async function getMedarbejdere() {
    const user = supabase.auth.user();
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) {
      console.log(error);
    }

    setMedarbejdere(data);
    console.log(data);
  }

  //Hent data fra supabase på alle oprettede timetracks
  async function getTidsregistrering() {
    const user = supabase.auth.user();
    const { data, error } = await supabase.from("timetrack").select("*");

    if (error) {
      console.log(error);
    }

    setTimetrackData(data);
    console.log(data);
  }

  useEffect(() => {
    getTidsregistrering();
  }, []);

  //Opret ny timetrack
  async function createTimeRegistration() {
    const user = supabase.auth.user();
    const { data, error } = await supabase.from("timetrack").insert({
      created_by: selectedPerson?.username,
      dato: startDate,
      kunde: kunde,
      kontaktperson: kontaktPerson,
      varighed: varighed,
      beskrivelse: beskrivelse,
    });

    toast.success("🎉 Tracking oprettet!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    //Reset form
    setBeskrivelse("");
    setKunde("");
    setKontaktPerson("");
    setVarighed(0);
    setStartDate(new Date());
    setSelectedPerson(null);
    setisDisabled(true);

    console.log(data);
    //Opdater UI
    getTidsregistrering();
  }

  //Sikkerhed for at vi har alle medarbejdere
  useEffect(() => {
    medarbejdere?.length > 0 ? "" : getMedarbejdere();
  }, [medarbejdere]);

  //Slet timetrack
  async function deleteTimeRegistration(id) {
    const { data, error } = await supabase
      .from("timetrack")
      .delete()
      .match({ id, id });

    toast.success("Tracking slettet!", {
      toastId: id,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    //opdater UI
    getTidsregistrering();
  }

  function filters(timetrackData) {
    return timetrackData.filter(
      (timetrackData) =>
        timetrackData?.created_by?.toLowerCase().includes(q.toLowerCase()) &&
        (søgKunde.length > 0
          ? timetrackData?.kunde?.toLowerCase().includes(søgKunde.toLowerCase())
          : true) &&
        (søgVarrighed > 0 ? timetrackData?.varighed > søgVarrighed : true)
    );
  }

  //Combobox for at vælge medarbejder + client-side filtering
  const filteredPeople =
    query === ""
      ? medarbejdere
      : medarbejdere?.filter((person) => {
          console.log(person.name);
          return person?.username.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <>
      <Header />
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-slate-800 bg-opacity-100" />
            </Transition.Child>

            <div className="fixed inset-0 flex z-40">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex-1 flex flex-col max-w-xs w-full ">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                      <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div className="flex-shrink-0 flex items-center px-4">
                      <img
                        className="h-24 w-full"
                        src="https://itoperators.dk/wp-content/uploads/2017/09/it-operators-ApS_hvid-200x77.png"
                        alt="itoperators Logo"
                      />
                    </div>
                    <nav className="mt-5 px-2 space-y-1">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-slate-400 text-gray-900"
                              : "text-gray-600 hover:bg-slate-500 hover:text-gray-900",
                            "group flex items-center px-2 py-2 text-base font-medium rounded-md"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-gray-500"
                                : "text-gray-400 group-hover:text-gray-500",
                              "mr-4 flex-shrink-0 h-6 w-6"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className="flex-shrink-0 w-14">
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="flex-1 flex flex-col min-h-0  bg-slate-800">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-18 w-full"
                  src="https://itoperators.dk/wp-content/uploads/2017/09/it-operators-ApS_hvid-200x77.png"
                  alt="itoperators Logo"
                />
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-gray-50"
                        : "text-gray-500 hover:bg-gray-900 hover:text-gray-100",
                      "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500",
                        "mr-3 flex-shrink-0 h-6 w-6"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="md:pl-64 flex flex-col flex-1">
          <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-slate-800">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <main className="flex-1">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex justify-between">
                <h1 className="text-2xl font-semibold text-gray-200">
                  Kontrolpanel
                </h1>
                <div className="tooltip" data-tip="Tilføj ny tidsregistrering">
                  <label
                    htmlFor="my-modal-6"
                    className=" modal-button cursor-pointer"
                  >
                    <PlusCircleIcon className="w-12 h-12 text-green-500" />
                  </label>
                </div>
              </div>

              {timetrackData?.length > 0 ? (
                <>
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="grid grid-cols-5 gap-4">
                      <input
                        type="text"
                        placeholder="Søg på medarbejder"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        className="input-bordered input mb-2 w-full max-w-xs mr-2"
                      />
                      <input
                        type="text"
                        placeholder="Søg på kunde"
                        value={søgKunde}
                        onChange={(e) => setSøgKunde(e.target.value)}
                        className="input-bordered input mb-2 w-full max-w-xs mr-2"
                      />
                      <input
                        type="number"
                        placeholder="Varighed større end"
                        value={søgVarrighed}
                        onChange={(e) => setSøgVarrighed(e.target.value)}
                        className="input-bordered input mb-2 w-full max-w-xs"
                      />
                    </div>
                    <div className="mt-8 flex flex-col">
                      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                              <thead className="bg-gray-800">
                                <tr>
                                  <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-200 sm:pl-6"
                                  >
                                    Medarbejder
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                                  >
                                    Varrighed
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                                  >
                                    Kunde
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                                  >
                                    Kontakt person
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                                  >
                                    Beskrivelse
                                  </th>
                                  <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                                  >
                                    Slet
                                  </th>
                                  <th
                                    scope="col"
                                    className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                                  >
                                    <span className="sr-only">Edit</span>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y  bg-slate-700">
                                {filters(timetrackData).map(
                                  (timetrack, index) => (
                                    <tr
                                      key={timetrack.created_by}
                                      className={
                                        index % 2 === 0
                                          ? undefined
                                          : "bg-slate-900"
                                      }
                                    >
                                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <div className="flex items-center">
                                          <div className="h-10 w-10 flex-shrink-0">
                                            <div className="w-10 rounded-full">
                                              <span className="text-3xl ">
                                                {timetrack?.created_by.slice(
                                                  0,
                                                  1
                                                )}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div className=" badge ">
                                          {timetrack.varighed} timer
                                        </div>
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
                                          {timetrack.kunde}
                                        </span>
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                        {timetrack.kontaktperson}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                        {timetrack.beskrivelse}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm text-white">
                                        <IconDelete
                                          className="text-red-600"
                                          onClick={(e) =>
                                            deleteTimeRegistration(timetrack.id)
                                          }
                                        />
                                      </td>

                                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"></td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* /End replace */}
                  </div>
                </>
              ) : (
                <div className="py-4">
                  <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 max-w-7xl mx-auto flex items-center justify-center">
                    <h1>
                      Der er ingen timetracks oprettet. Brug ikonet øverst til
                      højre for at oprette en.
                    </h1>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Modal til at oprette tidsregistrering*/}

      <input type="checkbox" id="my-modal-6" className="modal-toggle" />
      <div className="modal modal-bottom sm:modal-middle  ">
        <div className="modal-box">
          <div className="form-control w-full relative ">
            <label
              htmlFor="my-modal-6"
              className="btn btn-sm btn-circle absolute right-2 top-2 bg-red-700 border-0"
            >
              ✕
            </label>
            <h3 className="font-bold text-lg">Tilføj ny tidsregistrering</h3>
            <p className="py-4">Dato for udførelse</p>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="rounded-md"
            />

            <Combobox
              as="div"
              value={selectedPerson}
              onChange={setSelectedPerson}
              className="mx-auto w-full "
            >
              <Combobox.Label className="mx-auto block max-w-3xl text-sm font-medium text-gray-300 mt-4">
                Søg efter medarbejdere her...
              </Combobox.Label>
              <div className="relative mt-1">
                <Combobox.Input
                  className="w-full rounded-md   bg-slate-800 py-2 pl-3 pr-10 shadow-sm  sm:text-sm"
                  onChange={(event) => setQuery(event.target.value)}
                  onSelect={(event) => setQuery(event.target.value)}
                  displayValue={(person) => person?.username}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>

                {filteredPeople?.length > 0 && (
                  <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-slate-600 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredPeople.map((person) => (
                      <Combobox.Option
                        key={person.id}
                        value={person}
                        className={({ active }) =>
                          classNames(
                            "relative cursor-default select-none py-2 pl-3 pr-9",
                            active
                              ? "bg-indigo-600 text-white"
                              : "text-gray-200 "
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <div className="flex items-center ">
                              <div className="w-10 rounded-full">
                                <span className="text-3xl ">
                                  {person?.username?.slice(0, 1)}
                                </span>
                              </div>
                              <span
                                className={classNames(
                                  "ml-3 truncate",
                                  selected && "font-semibold"
                                )}
                              >
                                {person.username}
                              </span>
                            </div>

                            {selected && (
                              <span
                                className={classNames(
                                  "absolute inset-y-0 right-0 flex items-center pr-4",
                                  active ? "text-white" : "text-indigo-600"
                                )}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            )}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
            <div className="input-group flex items-center justify-center mt-4">
              <input
                type="number"
                placeholder="Varighed: indtast antal timer"
                value={varighed}
                onChange={(event) => setVarighed(event.target.value)}
                className="input input-bordered w-full  !outline-none "
              />
              <span className="btn no-animation">Timer</span>
            </div>
            <input
              type="text"
              placeholder="Kunde - (Eksempel: Dagrofa ApS)"
              value={kunde}
              onChange={(event) => setKunde(event.target.value)}
              className="input input-bordered w-full  !outline-none mt-4"
            />
            <input
              type="text"
              placeholder="Kontaktperson (Eksempel: John Doe)"
              value={kontaktPerson}
              onChange={(event) => setKontaktPerson(event.target.value)}
              className="input input-bordered w-full  !outline-none mt-4"
            />

            <textarea
              className="textarea textarea-bordered mt-4"
              placeholder="Beskrivelse"
              value={beskrivelse}
              onChange={(event) => setBeskrivelse(event.target.value)}
            ></textarea>
          </div>
          <div className="modal-action">
            <label
              htmlFor="my-modal-6"
              className="btn bg-green-600 text-white hover:bg-green-800 !border-0"
              onClick={(e) => {
                if (selectedPerson === null) {
                  toast.error("Du skal vælge en medarbejder");
                  return;
                } else if (varighed === 0) {
                  toast.error("Varighed skal udfyldes");
                  return;
                } else if (kunde.length < 0) {
                  toast.error("Kunde skal udfyldes");
                  return;
                } else if (startDate.length < 0) {
                  toast.error("Dato skal udfyldes");
                  return;
                } else if (kontaktPerson.length < 0) {
                  toast.error("Kontaktperson skal udfyldes");
                  return;
                } else if (beskrivelse.length < 0) {
                  toast.error("Beskrivelse skal udfyldes");
                  return;
                } else {
                  createTimeRegistration();
                  return false;
                }
              }}
              disabled={isDisabled}
            >
              Opret
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
