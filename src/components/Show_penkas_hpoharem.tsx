import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { Person } from "../model/Person";

const Show_penkas_hpoharem = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [searchId, setSearchId] = useState("");
  const [searchFirstName, setSearchFirstName] = useState("");
  const [searchFatherName, setSearchFatherName] = useState("");
  const [searchFamilyName, setSearchFamilyName] = useState("");

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

  useEffect(() => {
    const filtered = allPeople.filter((person) => {
      const idMatch = person.id_person?.toLowerCase().includes(searchId);
      const firstNameMatch = person.first_name
        ?.toLowerCase()
        .includes(searchFirstName);
      const fatherNameMatch = person.father_name
        ?.toLowerCase()
        .includes(searchFatherName);
      const familyNameMatch = person.family_name
        ?.toLowerCase() 
        .includes(searchFamilyName);

      return idMatch && firstNameMatch && fatherNameMatch && familyNameMatch;
    });

    setPeople(filtered);
  }, [searchId, searchFirstName, searchFatherName,searchFamilyName, allPeople]);

  return (
    <>
      <h1 style={{ textAlign: "center" }}>פנקס הבוחרים</h1>
      <p>מספר הבוחרים בפנקס: {totalVotes}</p>

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginBottom: "20px",
  }}
  dir="rtl"
>
  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      type="text"
      placeholder="חפש לפי תעודת זהות"
      onChange={(e) => setSearchId(e.target.value.toLowerCase())}
      style={{ width: "200px" }}
    />
    לפי ת.ז
  </label>

  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      type="text"
      placeholder="חפש לפי שם פרטי"
      onChange={(e) => setSearchFirstName(e.target.value.toLowerCase())}
      style={{ width: "200px" }}
    />
    שם פרטי
  </label>

  <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      type="text"
      placeholder="חפש לפי שם אבא"
      onChange={(e) => setSearchFatherName(e.target.value.toLowerCase())}
      style={{ width: "200px" }}
    />
    שם אבא
  </label>
    <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      type="text"
      placeholder="חפש לי שם משפחה"
      onChange={(e) => setSearchFamilyName(e.target.value.toLowerCase())}
      style={{ width: "200px" }}
    />
    שם משפחה
  </label>
</div>


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
                  width: "48px",
                  height: "28px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "16px",
                }}
              >
                {index + 1}
              </span>
              <span
                style={{
                  flexGrow: 1,
                  textAlign: "center",
                  marginRight: "12px",
                }}
              >
                {person.first_name} {person.father_name} {person.family_name}
              </span>
            </div>
            <div
              style={{ fontSize: "16px", color: "#555", textAlign: "center" }}
            >
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
