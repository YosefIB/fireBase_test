import React, { useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import * as XLSX from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // הנתיב לקובץ firebase.js

const UploadFile: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const data = new Uint8Array(result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData);

      uploadToFirebase(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const uploadToFirebase = async (data: any) => {
    const collectionRef = collection(db, "Penkas_ktan_lpdekot");
    for (const item of data) {
      await addDoc(collectionRef, item);
    }
  };

  const handlePasswordAndUpload = () => {
    const password = prompt("את צריך לדעת את הסיסמה חביבי - אי אפשר לעלות סתם כך קובץ");
    if (password === "777") {
      fileInputRef.current?.click();
    } else {
      alert("סיסמה שגויה!");
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} className="text-center">
          <h1 className="display-4">שלום</h1>
          <p>תעלה את פנקס הבוחרים הכי עדכני</p>

          <button onClick={handlePasswordAndUpload} className="btn btn-primary mt-3">
            העלאת קובץ
          </button>

          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default UploadFile;
