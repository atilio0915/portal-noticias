import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Main from "./Main";
import Menu from "./Menu";
import { useState } from "react";

function Sport(){
    const [search, setSearch] = useState("");
  const [isopen, setOpen] = useState(false);

  const changeopen = () => {
    setOpen((prevState) => !prevState); // mudar o estado para um diferente do anterior
  };
  return (
    <div
      style={{
        display: "flex",
        backgroundColor:"white",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
      }}
    >
      <Menu Isopen={isopen} />
      <Navbar
        Search={search}
        SetSearch={setSearch}
        Function={changeopen}
        Isopen={isopen}
      />
      <Main Search={search} categoria="sport" Isopen={isopen} />
      <Footer Isopen={isopen} />
    </div>
  )
}
export default Sport