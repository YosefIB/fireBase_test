import React from "react";
import logo from "./logo.svg";
import "./App.css";
import AddClient from "./components/AddClient";
import ClientList from "./components/ClientList";
import * as XLSX from "xlsx";
  import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase"; // הנתיב לקובץ firebase.js
import Show_penkas_hpoharem from "./components/Show_penkas_hpoharem";

function App() {

// הוספת פונקציה להעלאת קובץ אקסל
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  const reader = new FileReader();
  if (!file) {
    console.error("No file selected");
    return;
  }

  reader.onload = (event: ProgressEvent<FileReader>) => {
    const result = event.target?.result;
    if (!result) {
      console.error("File reading failed");
      return;
    }

    // המרת התוכן של הקובץ לאובייקט JSON
    const data = new Uint8Array(result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(jsonData); // כאן תראה את כל הנתונים מה-Excel
    // שלח ל-Firebase בשלב הבא
    
  uploadToFirebase(jsonData);

  };

  reader.readAsArrayBuffer(file);

}

const uploadToFirebase = async (data:any) => {
  const collectionRef = collection(db, "people2");
  for (const item of data) {
    await addDoc(collectionRef, item);
  }
};



  return (
    <div className="App">
     
      <header className="App-header">
         <h1 style={{color:"tomato"}}>YosefIB* FireBase Tests</h1>
         <p>תעלה מסמך אקסל</p>
         <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
        <AddClient />
        <ClientList />
        <Show_penkas_hpoharem />
      </header>
    </div>
  );
}

export default App;
