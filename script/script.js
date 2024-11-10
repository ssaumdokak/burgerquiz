import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, child, get, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAai0ZT6lTkxUklqPoXcQ3QRBSaCVHykI0",
  authDomain: "burger-ba3cc.firebaseapp.com",
  projectId: "burger-ba3cc",
  storageBucket: "burger-ba3cc.firebasestorage.app",
  messagingSenderId: "265943574881",
  appId: "1:265943574881:web:dcf40da2dafe76ec7e3d20",
  databaseURL: "https://burger-ba3cc-default-rtdb.firebaseio.com"
};

// Firebase initialization
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const questionTitle = document.querySelector('#question');
const prevBtn = document.querySelector('#prev');
const nextBtn = document.querySelector('#next');
const sendBtn = document.querySelector('#send');
const formAnswers = document.querySelector('#formAnswers');
const modalBlock = document.querySelector('#modalBlock');

const openTest = (questions) => {
    const finalAnswers = [];
    let numberQuestion = 0;

    const generateAnswers = (index) => {
        formAnswers.innerHTML = ''; // Clear previous answers
        questions[index].answers.forEach((answer) => {
            const answerItem = document.createElement('div');
            answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

            answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                <img class="answerImg" src="${answer.url}" alt="burger">
                <span>${answer.title}</span>
                </label>`

            formAnswers.appendChild(answerItem);
        })
    }

    const generateQuestions = (indexQuestion) => {
        formAnswers.innerHTML = '';

        if (numberQuestion === 0) {
            // First question setup
            questionTitle.textContent = questions[indexQuestion].question;
            generateAnswers(indexQuestion);
            nextBtn.classList.remove('d-none');
            prevBtn.classList.add('d-none');
            sendBtn.classList.add('d-none');
        } else if (numberQuestion === questions.length) {
            // Contact info form
            nextBtn.classList.add('d-none');
            prevBtn.classList.remove('d-none');
            sendBtn.classList.remove('d-none');
            questionTitle.textContent = "Заповніть контактні дані";

            formAnswers.innerHTML = `
                <div class="form-group">
                    <label for="userName">Ім'я</label>
                    <input type="text" class="form-control" id="userName" />
                </div>
                <div class="form-group">
                    <label for="phoneNumber">Номер телефону</label>
                    <input type="phone" class="form-control" id="phoneNumber" />
                </div>
            `;
        } else if (numberQuestion === questions.length + 1) {
            // Thank you message
            formAnswers.textContent = "Дякую!";
            sendBtn.classList.add('d-none');
            prevBtn.classList.add('d-none');
            setTimeout(() => {
                modalBlock.classList.remove('d-block');
            }, 2000);
        } else {
            // Regular question setup
            questionTitle.textContent = questions[indexQuestion].question;
            generateAnswers(indexQuestion);
            nextBtn.classList.remove('d-none');
            prevBtn.classList.remove('d-none');
            sendBtn.classList.add('d-none');
        }
    }
    
    generateQuestions(numberQuestion);

    const checkAnswer = () => {
        const obj = {};
        const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'phoneNumber' || input.id === 'userName');
        
        inputs.forEach((input, index) => {
            if(numberQuestion >= 0 && numberQuestion < questions.length) {
                obj[`${index+1}_${questions[numberQuestion].question}`] = input.value;
            } else if(numberQuestion === questions.length && input.id === 'phoneNumber') {
                obj[`Номер телефону`] = input.value;
            } else if (input.id === 'userName') {
                obj[`Ім'я користувача`] = input.value;
            }
        });
        
        finalAnswers.push(obj);
        console.log(finalAnswers);
    }

    nextBtn.onclick = () => {
        checkAnswer();
        numberQuestion++;
        generateQuestions(numberQuestion);
    }
    prevBtn.onclick = () => {
        numberQuestion--;
        generateQuestions(numberQuestion);
    }
    sendBtn.onclick = () => {
        checkAnswer();
        numberQuestion++;
        generateQuestions(numberQuestion);
        const contactsRef = ref(db, 'contacts');
        push(contactsRef, finalAnswers)
            .then(() => {
                console.log("Відповіді збережено!");
                finalAnswers.length = 0;
            })
            .catch((error) => {
                console.error("Error saving answers:", error);
            });
    }
}

get(child(ref(db), 'questions'))
    .then((snapshot) => {
        if (snapshot.exists()) {
            openTest(snapshot.val());
        } else {
            console.log("No data available");
        }
    })
    .catch((error) => {
        console.error(error);
        formAnswers.textContent = "Помилка";
    });

document.addEventListener('DOMContentLoaded', function(){
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const closeModal = document.querySelector('#closeModal');

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });
});
