import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

type Person = {
  id: string;
  name?: string;
  idNumber?: string;
};

const Show_penkas_hpoharem = () => {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "people2"));
      console.log(snapshot);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPeople(list);
    };

    fetchData();
  }, []);

  return (
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          {person.name} - {person.idNumber}
        </li>
      ))}
    </ul>
  );
};

export default Show_penkas_hpoharem;
