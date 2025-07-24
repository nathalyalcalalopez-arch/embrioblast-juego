let questions = [];
let current = 0;

const stages = [
  "assets/etapa1.png", // Espermatozoide
  "assets/etapa2.png", // Mórula
  "assets/etapa3.png", // Embrión
  "assets/etapa4.png", // Bebé
  "assets/etapa5.png"  // Niño
];
const stageLabels = [
  "Espermatozoide", "Mórula", "Embrión", "Bebé"
];

// Cargar preguntas
fetch('questions.json')
  .then(res => res.json())
  .then(qs => {
    questions = qs;
    setupGame();
  });

function setupGame() {
  const startScreen = document.getElementById('start-screen');
  const questionScreen = document.getElementById('question-screen');
  const endScreen = document.getElementById('end-screen');
  const stageImg = document.getElementById('stage-image');
  const progress = document.getElementById('progress');
  const questionDiv = document.getElementById('question');
  const optionsDiv = document.getElementById('options');
  const correctSound = document.getElementById('sound-correct');
  const wrongSound = document.getElementById('sound-wrong');

  document.getElementById('start-btn').onclick = () => {
    startScreen.classList.remove('active');
    questionScreen.classList.add('active');
    current = 0;
    showQuestion();
  };

  document.getElementById('restart-btn').onclick = () => {
    endScreen.classList.remove('active');
    startScreen.classList.add('active');
  };

  function showQuestion() {
    let stageIdx = Math.floor(current / 5);
    stageImg.src = stages[stageIdx];
    stageImg.alt = stageLabels[stageIdx];
    progress.textContent = `Pregunta ${current+1} de ${questions.length}`;

    questionDiv.textContent = questions[current].question;
    optionsDiv.innerHTML = "";
    questions[current].options.forEach((opt, idx) => {
      let btn = document.createElement('button');
      btn.textContent = opt;
      btn.onclick = () => answer(idx, btn);
      optionsDiv.appendChild(btn);
    });
  }

  function answer(selected, btnEl) {
    const isCorrect = selected === questions[current].answer;
    const buttons = optionsDiv.querySelectorAll('button');
    buttons.forEach((b, idx) => {
      if (idx === questions[current].answer) b.classList.add('correct');
      if (idx === selected && !isCorrect) b.classList.add('incorrect');
      b.disabled = true;
    });
    if (isCorrect) {
      correctSound.currentTime = 0;
      correctSound.play();
      setTimeout(() => {
        current++;
        if (current >= questions.length) {
          questionScreen.classList.remove('active');
          endScreen.classList.add('active');
        } else {
          showQuestion();
        }
      }, 700);
    } else {
      wrongSound.currentTime = 0;
      wrongSound.play();
      setTimeout(() => {
        current = 0;
        showQuestion();
      }, 900);
    }
  }
}
