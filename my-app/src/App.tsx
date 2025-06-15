import React from "react";
import logo from "./logo.svg";
import "./App.css";
import AddClient from "./components/AddClient";
import ClientList from "./components/ClientList";
import * as XLSX from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // הנתיב לקובץ firebase.js
import Show_penkas_hpoharem from "./components/Show_penkas_hpoharem";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import UploadFile from "./components/UploadFile";
import Voted from "./components/Voted";
import Main from "./components/Main";
import AovdeKalpi from "./components/AovdeKalpi";

function App() {


  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand href="/">מערכת יוסף</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/clients">רשימת לקוחות</Nav.Link>
                <Nav.Link href="/add-client">הוספת לקוח</Nav.Link>
                <Nav.Link href="/penkas">פנקס הבוחרים</Nav.Link>
                <Nav.Link href="/upload-file">העלאת קובץ</Nav.Link>
                <Nav.Link href="/voted">אנשים שהצביעו</Nav.Link>
                <Nav.Link href="/AovdeKalpi">עובדי קלפי</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          <Routes>
            <Route path="/clients" element={<ClientList />} />
            <Route path="/add-client" element={<AddClient />} />
            <Route path="/penkas" element={<Show_penkas_hpoharem />} />
            <Route path="/upload-file" element={<UploadFile />} />
            <Route path="/voted" element={<Voted />} />
            <Route path="/AovdeKalpi" element={<AovdeKalpi />} />
            <Route path="/" element={<Main />} />

          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
