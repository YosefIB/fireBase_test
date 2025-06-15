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
  const [totalVotes, setTotalVotes] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "Penkas_ktan_lpdekot"));
      console.log("voted people");
      console.log(snapshot);
      const list: Person[] = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Person, "id">) }));
      console.log(list);
      const votedPeople = list.filter((person) => person.vote===true);
      console.log("voted people list");
      console.log(votedPeople);
      setPeople(votedPeople);
      setTotalVotes(votedPeople.length);
    };

    fetchData();
  }, []);

  return (
    <>
    <h1 style={{textAlign:"center"}}>אנשים שהצביעו</h1>
    <p>עד כה הציעו {totalVotes}</p>
<ul>
  {people.map((person) => {
    const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16); // צבע HEX אקראי
    return (
      <li key={person.id}>
        <p style={{ fontSize: "30px", color: randomColor, fontWeight: "bold" }}>
          {person.פרטי} {person.אב} {person.משפחה} ת.ז: {person.תעודת_זהות}
        </p>
      </li>
    );
  })}
</ul>

    
    </>
  );
};

export default Voted;
