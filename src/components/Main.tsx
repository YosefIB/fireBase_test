import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase'; // ודא שזה הנתיב הנכון

const Main = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setMessage(`✅ נרשמת בהצלחה: ${userCredential.user.email}`);
    } catch (error: any) {
      setMessage(`❌ שגיאה בהרשמה: ${error.message}`);
    }
  };

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setMessage(`✅ התחברת בהצלחה: ${userCredential.user.email}`);
    } catch (error: any) {
      setMessage(`❌ שגיאה בהתחברות: ${error.message}`);
    }
  };

  return (
    <div>
    <div>
            <h1>בורכים הבאים למערכת יוסף</h1>
        <p>המערכת נועדה לנהל את פנקס הבוחרים של מפלגת יוסף</p>
        <p>המערכת מאפשרת להעלות קובץ אקסל עם פנקס הבוחרים, להוסיף לקוחות, להציג את פנקס הבוחרים ולראות מי הצביע</p>
        <p>המערכת משתמשת ב-Firebase לאחסון הנתונים</p>
        <p>המערכת נבנתה על ידי יוסף</p>
        <p>המערכת משתמשת ב-React, Firebase ו-Bootstrap</p>
        <p>המערכת נועדה לשפר את ניהול פנקס הבוחרים של מפלגת יוסף</p>
        <p>המערכת נועדה להיות קלה לשימוש ולספק פתרון נוח לניהול פנקס הבוחרים</p>
        <p>המערכת נועדה להיות זמינה לכל חברי המפלגה</p>
    </div>
    
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', direction: 'rtl' }}>
      <h2>התחברות / הרשמה</h2>
      <input
        type="email"
        placeholder="אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
        <button onClick={handleRegister} style={{ flex: 1 }}>הרשמה</button>
        <button onClick={handleLogin} style={{ flex: 1 }}>התחברות</button>
      </div>
      <p style={{ marginTop: '20px', color: 'blue' }}>{message}</p>
    </div>
    </div>
  );
};

export default Main;