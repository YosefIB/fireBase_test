import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import {Person} from "../model/Person"


const Show_penkas_hpoharem = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "Penkas_ktan_lpdekot"));
      console.log(snapshot);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPeople(list);
      setTotalVotes(list.length);
    };

    fetchData();
  }, []);

  return (
    <>
    <h1 style={{textAlign:"center"}}>פנקס הבוחרים</h1>
    <p>מספר הבוחרים בפנקס: {totalVotes}</p>
    <ul>
      {people.map((person) => (
        <li key={person.id}>
          <p style={{fontSize:"30px"}}> {person.פרטי} {person.אב} {person.משפחה} ת.ז: {person.תעודת_זהות}</p>
        </li>
      ))}
    </ul>
    </>
  );
};

export default Show_penkas_hpoharem;
