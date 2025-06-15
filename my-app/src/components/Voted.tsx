import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Person } from "../model/Person";

const Voted = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [totalPeople, setTotalPeople] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "Penkas_ktan_lpdekot"));
      const list: Person[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Person, "id">),
      }));

      setTotalPeople(list.length);

      const votedPeople = list.filter((person) => person.vote === true);
      setPeople(votedPeople);
      setTotalVotes(votedPeople.length);
    };

    // הפעלת fetchData כל שנייה
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    // ניקוי הטיימר כשמרכיב מתפרק
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>אנשים שהצביעו</h1>
      <p>בעלי זכות בחירה {totalPeople}</p>
      <p>כמה עוד לא הצביעו {totalPeople - totalVotes}</p>
      <p>עד כה הצביעו {totalVotes}</p>

      <ul>
        {people.map((person) => {
          const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
          return (
            <li key={person.id}>
              <p
                style={{
                  fontSize: "20px",
                  color: randomColor,
                  fontWeight: "bold",
                }}
              >
                {person.first_name} {person.father_name} {person.family_name} ת.ז: {person.id_person}
              </p>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default Voted;
