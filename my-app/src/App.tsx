import React from "react";
import logo from "./logo.svg";
import "./App.css";
import AddClient from "./components/AddClient";
import ClientList from "./components/ClientList";

function App() {
  return (
    <div className="App">
     
      <header className="App-header">
         <h1 style={{color:"tomato"}}>YosefIB* FireBase Tests</h1>
        <AddClient />
        <ClientList />
      </header>
    </div>
  );
}

export default App;
