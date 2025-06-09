// src/ClientList.tsx
import React, { useEffect, useState } from "react";
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Table, Container, Row, Col } from "react-bootstrap";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "my_task"));
        const clientsData: Client[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Client, "id">),
        }));
        setClients(clientsData);
      } catch (error) {
        console.error("שגיאה בקבלת לקוחות:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <Container fluid className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} lg={10}>
          <h2 className="text-center mb-4">רשימת לקוחות</h2>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>שם</th>
                  <th>אימייל</th>
                  <th>טלפון</th>
                  <th>כתובת</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{client.address}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ClientList;
