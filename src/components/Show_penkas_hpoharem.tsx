import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Person } from "../model/Person";

const Show_penkas_hpoharem = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [allPeople, setAllPeople] = useState<Person[]>([]);

const handleSearch = (searchTerm: string, field: keyof Person) => {
  const filtered = allPeople.filter((person) => {
    const value = person[field];
    if (typeof value === "string") {
      return value.toLowerCase().includes(searchTerm);
    }
    return false;
  });
  setPeople(filtered);
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
        console.error("שגיאה בקבלת הנתונים:", error);
      }
    );

    return () => unsubscribe(); // מנקה האזנה כשעוזבים את הקומפוננטה
  }, []);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>פנקס הבוחרים</h1>
      <p>מספר הבוחרים בפנקס: {totalVotes}</p>

      <label>
        חפש לפי ת.ז:
        <input
          type="text"
          placeholder="חפש לפי תעודת זהות"
          onChange={(e) => handleSearch(e.target.value.toLowerCase(), "id_person")}
          style={{ width: "300px", margin: "10px auto", display: "block" }}
        />
      </label>

      <label>
        חפש לפי שם פרטי:
        <input
          type="text"
          placeholder="חפש לפי שם פרטי"
          onChange={(e) => handleSearch(e.target.value.toLowerCase(), "first_name")}
          style={{ width: "300px", margin: "10px auto", display: "block" }}
        />
      </label>

      <label>
        חפש לפי שם אבא:
        <input
          type="text"
          placeholder="חפש לפי שם אבא"
          onChange={(e) => handleSearch(e.target.value.toLowerCase(), "father_name")}
          style={{ width: "300px", margin: "10px auto", display: "block" }}
        />
      </label>

      <ul
        style={{
          listStyleType: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {people.map((person, index) => (
          <li
            key={person.id}
            style={{
              background: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              direction: "rtl",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              <span
                style={{
                  backgroundColor: "#007bff",
                  color: "#fff",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                }}
              >
                {index + 1}
              </span>
              <span style={{ flexGrow: 1, textAlign: "center", marginRight: "12px" }}>
                {person.first_name} {person.father_name} {person.family_name}
              </span>
            </div>
            <div style={{ fontSize: "16px", color: "#555", textAlign: "center" }}>
              ת.ז: {person.id_person}{" "}
              <strong style={{ marginRight: "15px" }}>
                {person.vote ? "✅ הצביע" : "❌ לא הצביע"}
              </strong>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Show_penkas_hpoharem;
