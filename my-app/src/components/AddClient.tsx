// src/AddClient.tsx
import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

interface Client {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const AddClient: React.FC = () => {
  const [client, setClient] = useState<Client>({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'clients'), {
        ...client,
        createdAt: serverTimestamp(),
      });
      alert('הלקוח נוסף בהצלחה!');
      setClient({ name: '', email: '', phone: '', address: '' });
    } catch (error) {
      console.error('שגיאה בהוספת לקוח:', error);
    }
  };

  return (
    <>
    <p>Add Client to yosef FireBase Data Base</p>
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 300 }}>
      <input name="name" value={client.name} onChange={handleChange} placeholder="Name" required />
      <input name="email" value={client.email} onChange={handleChange} placeholder="Email" required />
      <input name="phone" value={client.phone} onChange={handleChange} placeholder="Phone" required />
      <input name="address" value={client.address} onChange={handleChange} placeholder="Address" required />
      <button type="submit">הוסף לקוח</button>
    </form>
    </>
  );
};

export default AddClient;
