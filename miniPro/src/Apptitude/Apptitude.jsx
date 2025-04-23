import React, { useState } from "react";
import styles from "./Apptitude.module.css";

const aptitudeTopics = [
  {
    title: "Quantitative Aptitude",
    questions: [
      {
        question: "What is 20% of 150?",
        options: ["20", "30", "25", "35"],
        answer: "30",
      },
      {
        question:
          "A train moving at 72 km/h crosses a pole in 10 sec. Find its length.",
        options: ["100 m", "200 m", "150 m", "250 m"],
        answer: "200 m",
      },
      {
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        answer: "12",
      },
      {
        question: "Solve: 8 × 7 + 6 =",
        options: ["50", "56", "62", "64"],
        answer: "62",
      },
      {
        question: "Find the value of 5³.",
        options: ["125", "150", "225", "250"],
        answer: "125",
      },
      {
        question: "What is 75% of 160?",
        options: ["100", "110", "120", "130"],
        answer: "120",
      },
      {
        question: "The average of 6, 8, 10, 12, and 14 is:",
        options: ["9", "10", "11", "12"],
        answer: "10",
      },
      {
        question: "Find the missing term in the sequence: 2, 4, 8, 16, __, 64.",
        options: ["24", "32", "40", "48"],
        answer: "32",
      },
      {
        question: "Solve: (15 + 5) ÷ 4 =",
        options: ["3", "4", "5", "6"],
        answer: "5",
      },
      {
        question:
          "A man walks 4 km east, then 3 km north. How far is he from the start?",
        options: ["5 km", "6 km", "7 km", "8 km"],
        answer: "5 km",
      },
      {
        question: "Solve: 3² + 4² =",
        options: ["9", "16", "25", "30"],
        answer: "25",
      },
      {
        question: "Find the area of a square with a side of 9 cm.",
        options: ["72 cm²", "81 cm²", "90 cm²", "99 cm²"],
        answer: "81 cm²",
      },
      {
        question:
          "What is the perimeter of a rectangle with length 10 cm and width 5 cm?",
        options: ["20 cm", "25 cm", "30 cm", "35 cm"],
        answer: "30 cm",
      },
      {
        question: "Find the value of 2⁵.",
        options: ["16", "32", "64", "128"],
        answer: "32",
      },
      {
        question:
          "A shopkeeper buys a pen for ₹40 and sells it for ₹50. Find the profit.",
        options: ["₹5", "₹10", "₹15", "₹20"],
        answer: "₹10",
      },
      {
        question: "How many hours are there in 3 days?",
        options: ["24", "48", "72", "96"],
        answer: "72",
      },
      {
        question:
          "A bag contains 5 red, 3 blue, and 2 green balls. Total balls?",
        options: ["8", "9", "10", "11"],
        answer: "10",
      },
      {
        question: "What is the LCM of 4 and 6?",
        options: ["8", "12", "16", "24"],
        answer: "12",
      },
      {
        question: "Find the HCF of 18 and 24.",
        options: ["2", "4", "6", "8"],
        answer: "6",
      },
      {
        question: "A car covers 120 km in 3 hours. What is its speed?",
        options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"],
        answer: "40 km/h",
      },
      {
        question: "A square has an area of 64 cm². Find its side length.",
        options: ["6 cm", "7 cm", "8 cm", "9 cm"],
        answer: "8 cm",
      },
      {
        question: "Find the sum: 1 + 3 + 5 + 7 + 9.",
        options: ["20", "25", "30", "35"],
        answer: "25",
      },
      {
        question: "Solve: 2 × (3 + 5) =",
        options: ["10", "12", "14", "16"],
        answer: "16",
      },
      {
        question: "Convert 2.5 hours into minutes.",
        options: ["120", "130", "140", "150"],
        answer: "150",
      },
    ],
  },
  {
    title: "Logical Reasoning",
    questions: [
      {
        question:
          "If A is B’s brother and B is C’s father, how is A related to C?",
        options: ["Uncle", "Brother", "Father", "Cousin"],
        answer: "Uncle",
      },
      {
        question: "What comes next in the series: 2, 6, 12, 20, _?",
        options: ["28", "30", "32", "34"],
        answer: "30",
      },
      {
        question: "Find the missing number: 3, 6, 11, 18, _?",
        options: ["26", "27", "28", "29"],
        answer: "27",
      },
      {
        question:
          "John is older than Sam. Sam is older than Bob. Who is the youngest?",
        options: ["John", "Sam", "Bob", "Can't say"],
        answer: "Bob",
      },
      {
        question: "If 1 = 3, 2 = 5, 3 = 7, then 4 = ?",
        options: ["7", "8", "9", "11"],
        answer: "9",
      },
      {
        question:
          "A clock shows 9:30. If the minute hand moves 90 degrees, what time is it?",
        options: ["10:00", "10:15", "10:30", "10:45"],
        answer: "10:00",
      },
      {
        question: "What is the missing number in: 1, 4, 9, 16, _?",
        options: ["20", "25", "30", "36"],
        answer: "25",
      },
      {
        question: "Which word does not belong to the group?",
        options: ["Apple", "Banana", "Carrot", "Mango"],
        answer: "Carrot",
      },
      {
        question: "Find the odd one out: 2, 5, 10, 17, 26, 37, 50, 64.",
        options: ["10", "17", "26", "64"],
        answer: "10",
      },
      {
        question: "Which shape has the most sides?",
        options: ["Triangle", "Pentagon", "Hexagon", "Octagon"],
        answer: "Octagon",
      },
      {
        question: "What comes next in the pattern: A, C, F, J, O, _?",
        options: ["Q", "T", "U", "V"],
        answer: "U",
      },
      {
        question: "If 5 apples cost ₹30, what is the price of 8 apples?",
        options: ["₹40", "₹45", "₹48", "₹50"],
        answer: "₹48",
      },
      {
        question:
          "Which number should replace the question mark? 1, 4, 9, 16, ?, 36",
        options: ["20", "24", "25", "30"],
        answer: "25",
      },
      {
        question:
          "If a cat is called a dog, a dog is called a rat, and a rat is called a lion, then what is a dog?",
        options: ["Rat", "Lion", "Dog", "Cat"],
        answer: "Rat",
      },
      {
        question: "What comes next in the series: 3, 9, 27, 81, _?",
        options: ["162", "243", "324", "729"],
        answer: "243",
      },
      {
        question: "Which number is missing? 1, 3, 7, 15, 31, ?",
        options: ["57", "58", "63", "62"],
        answer: "63",
      },
      {
        question:
          "A clock shows 3:15. What is the angle between the hour and minute hands?",
        options: ["0°", "30°", "37.5°", "45°"],
        answer: "37.5°",
      },
      {
        question: "Find the odd one out: Sun, Moon, Mars, Earth.",
        options: ["Sun", "Moon", "Mars", "Earth"],
        answer: "Sun",
      },
      {
        question: "If Monday is coded as 4151624, then Friday is coded as?",
        options: ["6184619", "6194518", "6184919", "6194819"],
        answer: "6194819",
      },
      {
        question:
          "If a circle represents females, a square represents engineers, and a triangle represents doctors, which shape represents female doctors?",
        options: ["Triangle", "Circle", "Square", "Circle inside Triangle"],
        answer: "Circle inside Triangle",
      },
      {
        question:
          "In a row of students, A is 10th from the left and B is 15th from the right. If there are 25 students, what is the position of A from the right?",
        options: ["10", "12", "15", "16"],
        answer: "16",
      },
      {
        question: "Which letter comes next in the series: B, E, H, K, _?",
        options: ["M", "N", "O", "P"],
        answer: "N",
      },
      {
        question: "What comes next: 2, 5, 10, 17, 26, ?",
        options: ["34", "36", "38", "40"],
        answer: "38",
      },
      {
        question: "What number comes next in: 1, 2, 4, 8, 16, _?",
        options: ["24", "30", "32", "36"],
        answer: "32",
      },
      {
        question:
          "A mother is 4 times as old as her daughter. After 12 years, she will be twice as old. What is the daughter's age now?",
        options: ["4", "6", "8", "10"],
        answer: "6",
      },
    ],
  },
  {
    title: "Verbal Test",
    questions: [
      {
        question: "Choose the word that is most similar to 'BENEVOLENT'.",
        options: ["Generous", "Cruel", "Unkind", "Selfish"],
        answer: "Generous",
      },
      {
        question: "Which word is opposite to 'TRANSPARENT'?",
        options: ["Clear", "Opaque", "Bright", "Dull"],
        answer: "Opaque",
      },
      {
        question: "Which sentence is grammatically correct?",
        options: [
          "She don’t like coffee.",
          "She doesn’t likes coffee.",
          "She doesn’t like coffee.",
          "She don’t likes coffee.",
        ],
        answer: "She doesn’t like coffee.",
      },
      {
        question: "Find the correctly spelled word.",
        options: ["Acommodate", "Accommodate", "Acomodate", "Acommmodate"],
        answer: "Accommodate",
      },
      {
        question: "Which word does not belong to the group?",
        options: ["Table", "Chair", "Bench", "Apple"],
        answer: "Apple",
      },
      {
        question: "Find the odd one out.",
        options: ["Dog", "Lion", "Tiger", "Elephant"],
        answer: "Dog",
      },
      {
        question: "Which of these is a synonym for 'DILIGENT'?",
        options: ["Lazy", "Hardworking", "Careless", "Slow"],
        answer: "Hardworking",
      },
      {
        question: "Choose the correct meaning of the idiom: 'Break the ice'.",
        options: [
          "To start a conversation",
          "To break something",
          "To make ice cubes",
          "To feel cold",
        ],
        answer: "To start a conversation",
      },
      {
        question: "Choose the correct passive voice: 'He wrote a novel.'",
        options: [
          "A novel is written by him.",
          "A novel was written by him.",
          "A novel wrote him.",
          "A novel is writing by him.",
        ],
        answer: "A novel was written by him.",
      },
      {
        question: "Which sentence uses the correct article?",
        options: [
          "She adopted a cat and a dog.",
          "She adopted an cat and a dog.",
          "She adopted a cat and an dog.",
          "She adopted an cat and an dog.",
        ],
        answer: "She adopted a cat and a dog.",
      },
      {
        question: "Which of the following is an antonym for 'FEEBLE'?",
        options: ["Weak", "Strong", "Soft", "Lazy"],
        answer: "Strong",
      },
      {
        question: "Find the correctly spelled word.",
        options: ["Definately", "Definitely", "Definetely", "Definitaly"],
        answer: "Definitely",
      },
      {
        question:
          "Which of the following words means 'a place where bees are kept'?",
        options: ["Colony", "Nest", "Hive", "Cage"],
        answer: "Hive",
      },
      {
        question: "Which word best describes a person who talks a lot?",
        options: ["Reserved", "Talkative", "Silent", "Introverted"],
        answer: "Talkative",
      },
      {
        question: "Find the correctly used conjunction.",
        options: [
          "She is both intelligent or hardworking.",
          "She is both intelligent and hardworking.",
          "She is both intelligent nor hardworking.",
          "She is both intelligent but hardworking.",
        ],
        answer: "She is both intelligent and hardworking.",
      },
      {
        question: "Choose the correct synonym for 'OBSOLETE'.",
        options: ["New", "Modern", "Outdated", "Fresh"],
        answer: "Outdated",
      },
      {
        question: "Choose the correct indirect speech: He said, 'I am happy.'",
        options: [
          "He said he is happy.",
          "He said he was happy.",
          "He said I am happy.",
          "He said he were happy.",
        ],
        answer: "He said he was happy.",
      },
      {
        question:
          "Which word best fits in: 'The meeting was ______ until next week.'",
        options: ["Postponed", "Cancelled", "Continued", "Ended"],
        answer: "Postponed",
      },
      {
        question: "Choose the correct meaning of the idiom: 'Hit the sack'.",
        options: [
          "To go to sleep",
          "To hit someone",
          "To go shopping",
          "To win a game",
        ],
        answer: "To go to sleep",
      },
      {
        question: "Which sentence is correct?",
        options: [
          "The book is in the table.",
          "The book is on the table.",
          "The book is at the table.",
          "The book is by the table.",
        ],
        answer: "The book is on the table.",
      },
      {
        question: "Choose the correct past tense of 'Go'.",
        options: ["Gone", "Went", "Goes", "Going"],
        answer: "Went",
      },
      {
        question: "Which of the following is a noun?",
        options: ["Run", "Eat", "Happiness", "Sleep"],
        answer: "Happiness",
      },
      {
        question: "What is the plural of 'Child'?",
        options: ["Childs", "Children", "Childes", "Child's"],
        answer: "Children",
      },
      {
        question: "Which of these words is a preposition?",
        options: ["Fast", "Under", "Quietly", "Beautiful"],
        answer: "Under",
      },
      {
        question:
          "Which word completes this analogy? 'Night is to Dark as Day is to __'.",
        options: ["Hot", "Cold", "Bright", "Sleep"],
        answer: "Bright",
      },
    ],
  },
];

const ApptitudePage = () => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleOptionChange = (question, option) => {
    setAnswers({ ...answers, [question]: option });
  };

  const handleSubmit = () => {
    let correct = 0;
    selectedTopic.questions.forEach((q) => {
      if (answers[q.question] === q.answer) {
        correct++;
      }
    });
    setScore(correct);
  };

  return (
    <div className={styles.container}>
      <h1>Take Test</h1>
      {!selectedTopic ? (
        <div className={styles.topicList}>
          {aptitudeTopics.map((topic, index) => (
            <button
              key={index}
              className={styles.topicButton}
              onClick={() => setSelectedTopic(topic)}
            >
              {topic.title}
            </button>
          ))}
        </div>
      ) : (
        <div className={styles.questionContainer}>
          <h2>{selectedTopic.title}</h2>
          {selectedTopic.questions.map((q, index) => (
            <div key={index} className={styles.questionBlock}>
              <p className={styles.question}>{q.question}</p>
              <div className={styles.options}>
                {q.options.map((option, i) => (
                  <label key={i} className={styles.optionLabel}>
                    <input
                      type="radio"
                      name={q.question}
                      value={option}
                      onChange={() => handleOptionChange(q.question, option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className={styles.buttonContainer}>
            <button className={styles.submitBtn} onClick={handleSubmit}>
              Submit
            </button>
            <button
              className={styles.backBtn}
              onClick={() => setSelectedTopic(null)}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {score !== null && (
        <div className={styles.floatingScore}>
          <div className={styles.closeBtn} onClick={() => setScore(null)}>
            X
          </div>
          <p id="scorebtn" className={styles.scorebtn}>
            {" "}
            SCORE : {score} / {selectedTopic.questions.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default ApptitudePage;
