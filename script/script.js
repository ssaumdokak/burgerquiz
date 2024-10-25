// обробник подій, який відстежує завантаження контенту
document.addEventListener('DOMContentLoaded', function(){
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');

// об'єкт, що містить питання та відповіді
    const questions = [
        {
            question: "Якого кольору бургер?",
            answers: [
                {
                    title: 'Стандарт',
                    url: './image/burger.png'
                },
                {
                    title: 'Чорний',
                    url: './image/burgerBlack.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "З якого м'яса котлета?",
            answers: [
                {
                    title: 'Курка',
                    url: './image/chickenMeat.png'
                },
                {
                    title: 'Яловичина',
                    url: './image/beefMeat.png'
                },
                {
                    title: 'Свинина',
                    url: './image/porkMeat.png'
                }
            ],
            type: 'radio'
        },
        {
            question: "Додаткові інгредієнти?",
            answers: [
                {
                    title: 'Помідор',
                    url: './image/tomato.png'
                },
                {
                    title: 'Огірок',
                    url: './image/cucumber.png'
                },
                {
                    title: 'Салат',
                    url: './image/salad.png'
                },
                {
                    title: 'Цибуля',
                    url: './image/onion.png'
                }
            ],
            type: 'checkbox'
        },
        {
            question: "Додати соус?",
            answers: [
                {
                    title: 'Часниковий',
                    url: './image/sauce1.png'
                },
                {
                    title: 'Томатний',
                    url: './image/sauce2.png'
                },
                {
                    title: 'Гірчичний',
                    url: './image/sauce3.png'
                }
            ],
            type: 'radio'
        }
    ];

    // обробники подій відкриття/закриття модального вікна
    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        playTest();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });

    // функція запуску тестування
    const playTest = () => {

        const finalAnswers = [];

        // змінна з номером питання
        let numberQuestion = 0;

        // функція рендерингу відповідей
        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');

                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                    <img class="answerImg" src="${answer.url}" alt="burger">
                    <span>${answer.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);
            });
        }

        // функція рендерингу питань + відповідей
        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';

            switch (true) {
                case numberQuestion === 0:
                    prevButton.classList.add('d-none');
                    break;
                case numberQuestion <= questions.length - 1:
                    prevButton.classList.remove('d-none');
                    nextButton.classList.remove('d-none');
                    sendButton.classList.add('d-none');
                    break;
                case numberQuestion === questions.length:
                    prevButton.classList.add('d-none');
                    nextButton.classList.add('d-none');
                    sendButton.classList.remove('d-none');
                    break;
                default: break;
            }

            if(numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                questionTitle.textContent = `${questions[indexQuestion].question}`;
                renderAnswers(indexQuestion);
            }

            if(numberQuestion === questions.length) {
                nextButton.classList.add('d-none');
                prevButton.classList.add('d-none');
                sendButton.classList.remove('d-none');

                formAnswers.innerHTML = `
                    <div class="form-group">
                        <label for="numberPhone">Введіть свій номер</label>
                        <input type="phone" class="form-control" id="numberPhone">
                    </div>
                `;
            }

            if(numberQuestion === questions.length + 1) {
                formAnswers.textContent = 'Дякуємо за пройдений тест!';
                setTimeout(() => {
                    modalBlock.classList.remove('d-block');
                }, 2000);
            }

        } 

        // запуск функції рендерингу 
        renderQuestions(numberQuestion);  

        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone')

            inputs.forEach((input, index) => {
               if(numberQuestion >= 0 && numberQuestion <= questions.length - 1) {
                obj[`${index}_${questions[numberQuestion].question}`] = input.value;
               }

               if(numberQuestion === questions.length) {
                obj['Номер телефону'] = input.value;
               }
            });

            finalAnswers.push(obj);
        }

        // обробники подій кнопок next і prev
        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            console.log(finalAnswers);
        }
    }

})
