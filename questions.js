const questions = [
    {
        question: "Якого кольору бургер?",
        answers: [
            {
                title: 'Стандартний',
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
        question: "З якого м’яса котлета?",
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

// Змінна для зберігання відповідей користувача
const finalAnswers = [];

// Функція для отримання даних
const getData = () => {
    formAnswers.textContent = 'ЗАВАНТАЖЕННЯ...';

    setTimeout(() => {
        fetch('http://localhost:81/Quiz__intens/db.json')
            .then(res => res.json())
            .then(data => playTest(data.questions)) // 'data' замість 'obj' для уникнення конфліктів
    }, 2000);
}

// Обробка вибраних відповідей користувача
const obj = {};
const inputs = [...formAnswers.elements].filter(elem => elem.checked);

inputs.forEach((elem, index) => {
    obj[`${index}_${questions[numberQuestion].question}`] = elem.value;
});
finalAnswers.push(obj);
