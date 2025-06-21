import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { Person } from "../model/Person";
import "bootstrap/dist/css/bootstrap.min.css";

const AllInformation = () => {
  interface PersonWithTime extends Person {
    voted_at?: Timestamp;
  }

  interface FamilyData {
    name: string;
    total: number;
    voted: number;
    percent: number;
  }

  const [familyStats, setFamilyStats] = useState<FamilyData[]>([]);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [totalPeople, setTotalPeople] = useState<number>(0);

  const families = [
    { key: "ibrahim", name: "אברהים" },
    { key: "jabr", name: "גבר" },
    { key: "abuKtish", name: "אבו קטיש" },
    { key: "zrem", name: "זרים" },
    { key: "khateb", name: "חטיב" },
    { key: "salah", name: "סאלח" },
    { key: "abedAlRahman", name: "עבד אלרחמן" },
    { key: "otman", name: "עותמאן" },
    { key: "alyan", name: "עליאון" },
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Penkas_ktan_lpdekot"),
      (snapshot) => {
        const list: PersonWithTime[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<PersonWithTime, "id">),
        }));

        setTotalPeople(list.length);

        const votedList = list.filter((p) => p.vote === true);
        setTotalVotes(votedList.length);

        const newFamilyStats: FamilyData[] = families.map(({ name }) => {
          const familyPeople = list.filter((p) => p.family?.includes(name));
          const voted = familyPeople.filter((p) => p.vote === true).length;
          const total = familyPeople.length;
          const percent = total > 0 ? (voted / total) * 100 : 0;
          return {
            name,
            total,
            voted,
            percent,
          };
        });

        // sort by highest voting percentage
        newFamilyStats.sort((a, b) => b.percent - a.percent);

        setFamilyStats(newFamilyStats);
      },
      (error) => {
        console.error("Error listening to data:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
<div className="container mt-4" dir="rtl">
  <h2 className="text-center mb-4">📊 תמונת מצב בזמן אמת</h2>
  <div className="mb-3 text-center">
    <p>סה"כ בעלי זכות בחירה: <strong>{totalPeople}</strong></p>
    <p>סה"כ הצביעו עד עכשיו: <strong>{totalVotes}</strong></p>
    <p>עדיין לא הצביעו: <strong>{totalPeople - totalVotes}</strong></p>
    <p>
      אחוז הצבעה כולל:{" "}
      <strong>
        {totalPeople > 0
          ? ((totalVotes / totalPeople) * 100).toFixed(2)
          : "0"}
        %
      </strong>
    </p>
  </div>


      <div className="table-responsive">
        <table className="table table-striped table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>משפחה</th>
              <th>הצביעו</th>
              <th>סך הכל</th>
              <th>אחוזי הצבעה</th>
            </tr>
          </thead>
          <tbody>
            {familyStats.map((family) => (
              <tr key={family.name}>
                <td>{family.name}</td>
                <td>{family.voted}</td>
                <td>{family.total}</td>
                <td>
                  <span
                    className={
                      family.percent >= 75
                        ? "text-success fw-bold"
                        : family.percent >= 40
                        ? "text-warning fw-bold"
                        : "text-danger fw-bold"
                    }
                  >
                    {family.percent.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllInformation;