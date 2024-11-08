  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCzcpN86vJH0vHAu1OTF9TP_j_D8iGiCVo",
    authDomain: "burgerquiz-4d48d.firebaseapp.com",
    databaseURL: "https://burgerquiz-4d48d-default-rtdb.firebaseio.com",
    projectId: "burgerquiz-4d48d",
    storageBucket: "burgerquiz-4d48d.firebasestorage.app",
    messagingSenderId: "698383220400",
    appId: "1:698383220400:web:98b54d66c17c3fc624c575",
    measurementId: "G-4NW9H6EJBP"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

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
