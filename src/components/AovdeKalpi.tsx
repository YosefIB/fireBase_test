import { collection, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Person } from "../model/Person";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const AovdeKalpi = () => {
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const toggleVote = async (personId: string, currentVote?: boolean) => {
    const newVote = !currentVote;
    const personRef = doc(db, "Penkas_ktan_lpdekot", personId);

    try {
      await updateDoc(personRef, { vote: newVote });
      await updateDoc(personRef, { voted_at: serverTimestamp() });

      setAllPeople((prev) =>
        prev.map((p) => (p.id === personId ? { ...p, vote: newVote } : p))
      );
      
    } catch (error) {
      console.error("שגיאה בעדכון ההצבעה:", error);
      toast.error("אירעה שגיאה בעדכון ההצבעה.");
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

  useEffect(() => {
    const filteredPeople = allPeople.filter((person) =>
      person.id_person?.toLowerCase().includes(searchTerm)
    );
    setPeople(filteredPeople);
  }, [allPeople, searchTerm]);

  return (
    <div className="container mt-4" dir="rtl">
      <h1 className="text-center mb-4">עובדי קלפי</h1>
      <ToastContainer />

      <div className="mb-3 text-center">
        <input
          type="text"
          placeholder="חפש לפי תעודת זהות"
          onChange={handleSearch}
          className="form-control w-50 mx-auto"
        />
      </div>

      <div className="row">
        {people.map((person) => (
          <div className="col-md-6 col-lg-4 mb-4" key={person.id}>
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h5 className="card-title">
                  {person.first_name} {person.father_name} {person.family_name}
                </h5>
                <p className="card-text">ת.ז: {person.id_person}</p>
                <p className="card-text">
                  סטטוס:{" "}
                  <strong className={person.vote ? "text-success" : "text-danger"}>
                    {person.vote ? "✅ הצביע" : "❌ לא הצביע"}
                  </strong>
                </p>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => toggleVote(person.id, person.vote)}
                >
                  שנה הצבעה
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AovdeKalpi;
