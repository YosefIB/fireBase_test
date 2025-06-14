import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import * as XLSX from "xlsx";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // הנתיב לקובץ firebase.js

const UploadFile: React.FC = () => {
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
  };

  const uploadToFirebase = async (data: any) => {
    const collectionRef = collection(db, "people2");
    for (const item of data) {
      await addDoc(collectionRef, item);
    }
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} className="text-center">
          <h1 className="display-4">שלום</h1>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="form-control mt-3"
            />
        </Col>
      </Row>
    </Container>
  );
};

export default UploadFile;
