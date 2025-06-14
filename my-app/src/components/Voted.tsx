import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

type Person = {
  id: string;
  אב?: string;
  פרטי?: string;
  משפחה?: string;
  תעודת_זהות?: string;
  vote?: boolean;
};

const Voted = () => {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "people2"));
      console.log("voted people");
      console.log(snapshot);
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(list);
      const votedPeople = list.filter((person) => person.vote);


      console.log("voted people list");
      console.log(votedPeople);
      setPeople(list);
    };

    fetchData();
  }, []);

  return (
    <>
    <h1 style={{textAlign:"center"}}>אנשים שהצביעו</h1>
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

export default Voted;
