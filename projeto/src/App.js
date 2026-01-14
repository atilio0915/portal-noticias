
import "./App.css";
import Home from "./componentes/Home";
import War from "./componentes/War"
import Science from "./componentes/Science";
import Sport from "./componentes/Sport";
import Cadastro from "./componentes/Cadastro";
import Tecnology from "./componentes/Tecnology";
import Perfil from "./componentes/Perfil";
import React, { useState, useEffect } from "react";
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import Entrar from "./componentes/Entrar";
import { CookiesProvider } from "react-cookie";

const router = createBrowserRouter([
  {path: "/", element:<Cadastro/>},
  {path: "/home",element:<Home/>}, // um espaço faz a diferença kkkkkk
  {path: "/sport", element : <Sport />},
  {path: "/tecnology", element : <Tecnology />},
  {path: "/science", element : <Science/>},
  {path: "/war", element : <War />},
  {path:"/entrar", element:<Entrar/>},
  {path:"/perfil", element:<Perfil/>},
])

function App() {
  
  return (

      <div className="App">
        <CookiesProvider>
         <RouterProvider router={router} />
        </CookiesProvider>
      </div>
    
  );
}

export default App;
