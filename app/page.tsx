'use client'

import { useState } from "react"
import HomePage from "@/components/HomePage"      // if you separate components
import ScriptsPage from "@/components/ScriptsPage"
import UpdatesPage from "@/components/UpdatesPage"
import Navbar from "@/components/Navbar"

export default function Page() {
  const [page, setPage] = useState("home")

  return (
    <>
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} />}
      {page === "scripts" && <ScriptsPage />}
      {page === "updates" && <UpdatesPage />}
    </>
  )
}
