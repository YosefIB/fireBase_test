import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Person } from "../model/Person";

const Voted = () => {
  const [people, setPeople] = useState<PersonWithTime[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [totalPeople, setTotalPeople] = useState<number>(0);
  const [ahoze_hatsba, setAhoze_hatsba] = useState<string>("");

  interface PersonWithTime extends Person {
    voted_at?: Timestamp; // שדה זמן מה-DB
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Penkas_ktan_lpdekot"),
      (snapshot) => {
        const list: PersonWithTime[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PersonWithTime, "id">),
        }));

        setTotalPeople(list.length);

        const votedPeople = list.filter((person) => person.vote === true);
        setPeople(votedPeople);
        setTotalVotes(votedPeople.length);
        
      },
      (error) => {
        console.error("Error listening to data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center", background:"yellow"}}>אנשים שהצביעו</h1>
      <p>בעלי זכות בחירה {totalPeople}</p>
      <p>כמה עוד לא הצביעו {totalPeople - totalVotes}</p>
      <p>עד כה הצביעו {totalVotes}</p>
      <p>אחוזי הצבעה {((totalVotes/totalPeople)*100).toFixed(2)}%</p>

<ul style={{
  listStyleType: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}}>
  {people.map((person, index) => {
const voteTime = (person.voted_at instanceof Timestamp)
  ? person.voted_at.toDate().toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  : null;


    return (
      <li
        key={person.id}
        style={{
          background: "#f9f9f9",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "16px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          direction: "rtl"
        }}
      >
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
          fontWeight: "bold",
          fontSize: "18px"
        }}>
          <span style={{
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "50%",
            width: "28px",
            height: "28px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "16px"
          }}>
            {index + 1}
          </span>
          <span style={{ flexGrow: 1, textAlign: "center", marginRight: "12px" }}>
            {person.first_name} {person.father_name} {person.family_name}
          </span>
        </div>

        <div style={{ fontSize: "16px", color: "#555" }}>
          ת.ז: {person.id_person}
          {voteTime && (
            <span style={{ display: "block", marginTop: "4px", color: "#28a745", fontWeight: "500" }}>
              הצביע בשעה: {voteTime}
            </span>
          )}
        </div>
      </li>
    );
  })}
</ul>


    </>
  );
};

export default Voted;
