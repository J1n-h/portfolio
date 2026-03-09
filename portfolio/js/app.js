// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

// Your web app's Firebase configuration (from README.MD)
const firebaseConfig = {
    apiKey: "AIzaSyDN2tvyH9yzCFtcAuzUWQYTuA4g6s_bCj8",
    authDomain: "portfolio-6fded.firebaseapp.com",
    projectId: "portfolio-6fded",
    storageBucket: "portfolio-6fded.firebasestorage.app",
    messagingSenderId: "365358771894",
    appId: "1:365358771894:web:6fd6cdd1745a3f346bc017"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load projects from Firestore and render them
async function loadProjects() {
    const listEl = document.getElementById('project-list');
    try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        querySnapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement('li');
            li.textContent = `${data.title || 'Untitled'} - ${data.description || ''}`;
            listEl.appendChild(li);
        });
    } catch (e) {
        console.error('Error loading projects:', e);
        listEl.textContent = '프로젝트를 불러오는 중 오류가 발생했습니다.';
    }
}

window.addEventListener('DOMContentLoaded', loadProjects);
