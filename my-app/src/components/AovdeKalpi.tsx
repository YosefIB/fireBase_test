import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

type Person = {
  id: string;
  אב?: string;
  פרטי?: string;
  משפחה?: string;
  תעודת_זהות?: string;
  הצביע?: boolean;
};

const AovdeKalpi = () => {
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPeople = allPeople.filter((person) =>
      person.תעודת_זהות?.toLowerCase().includes(searchTerm)
    );
    setPeople(filteredPeople);
  };

  const toggleVote = async (personId: string, currentVote?: boolean, תז?:string) => {
    const newVote = !currentVote;
    const personRef = doc(db, "Penkas_ktan_lpdekot", personId);

    try {
      await updateDoc(personRef, { הצביע: newVote });

      // עדכון ב-people וב-allPeople
      setAllPeople((prev) =>
        prev.map((p) =>
          p.id === personId ? { ...p, הצביע: newVote } : p
        )
      );
      setPeople((prev) =>
        prev.map((p) =>
          p.id === personId ? { ...p, הצביע: newVote } : p
        )
      );
    } catch (error) {
      console.error("שגיאה בעדכון ההצבעה:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "Penkas_ktan_lpdekot"));
      const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Person[];
      setAllPeople(list);
      setPeople(list);
      setTotalVotes(list.length);
    };

    fetchData();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>פנקס הבוחרים</h1>
      <p>חפש לפי ת.ז של הבוחר</p>
      <input
        type="text"
        placeholder="חפש לפי תעודת זהות"
        onChange={handleSearch}
        style={{ width: "300px", margin: "20px auto", display: "block" }}
      />

      <ul>
        {people.map((person) => (
          <li key={person.id}>
            <p style={{ fontSize: "30px" }}>
              {person.פרטי} {person.אב} {person.משפחה} ת.ז: {person.תעודת_זהות}{" "}
              <strong>{person.הצביע ? "✅ הצביע" : "❌ לא הצביע"}</strong>
            </p>
            <button
              onClick={() => toggleVote(person.id, person.הצביע,person.תעודת_זהות)}
              style={{ fontSize: "16px", marginBottom: "10px" }}
            >
              שנה הצבעה
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AovdeKalpi;
