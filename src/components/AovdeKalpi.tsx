import { collection, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Person } from "../model/Person";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AovdeKalpi = () => {
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredPeople = allPeople.filter((person) =>
      person.id_person?.toLowerCase().includes(searchTerm)
    );
    setPeople(filteredPeople);
  };

  const toggleVote = async (personId: string, currentVote?: boolean) => {
    const newVote = !currentVote;
    const personRef = doc(db, "Penkas_ktan_lpdekot", personId);

    try {
      await updateDoc(personRef, { vote: newVote });
      await updateDoc(personRef, { voted_at: serverTimestamp() });

      toast.success(`✅ ההצבעה של ${newVote ? "הוספה" : "הוסרה"} בהצלחה!`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });

      // עדכון המערכים
      setAllPeople((prev) =>
        prev.map((p) =>
          p.id === personId ? { ...p, vote: newVote } : p
        )
      );
      setPeople((prev) =>
        prev.map((p) =>
          p.id === personId ? { ...p, vote: newVote } : p
        )
      );
    } catch (error) {
      console.error("שגיאה בעדכון ההצבעה:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Penkas_ktan_lpdekot"),
      (snapshot) => {
        const list: Person[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Person, "id">),
        }));
        setAllPeople(list);
        setPeople(list);
        setTotalVotes(list.length);
      },
      (error) => {
        console.error("שגיאה בהאזנה לנתונים:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>עובדי קלפי</h1>

      {/* Toast popup */}
      <ToastContainer />

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
            <p style={{ fontSize: "15px" }}>
              {person.first_name} {person.father_name} {person.family_name} ת.ז: {person.id_person}{" "}
            </p>
            <button
              onClick={() => toggleVote(person.id, person.vote)}
              style={{ fontSize: "16px", marginBottom: "10px", marginRight: "30px" }}
            >
              שנה הצבעה
            </button>
            <strong>{person.vote ? "✅ הצביע" : "❌ לא הצביע"}</strong>
            <p>-------------------------------------------------</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default AovdeKalpi;
