/*
 * Controle principal do jogo.
 * O estado fica apenas em memória durante a execução da página.
 */
const DIFFICULTY_LABELS = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil"
};

const CORRECT_FEEDBACK_MESSAGES = [
  "Muito bem! Você acertou! 🎉",
  "Boa! Essa resposta está certinha! 😊",
  "Parabéns! Você mandou bem! ⭐",
  "Isso mesmo! Que legal! 🥳"
];

const WRONG_FEEDBACK_MESSAGES = [
  "Quase! A resposta certa era: {answer} 🙂",
  "Tudo bem! Vamos aprender juntos: a resposta certa era {answer} 🌟",
  "Boa tentativa! A resposta correta é {answer} 💡",
  "Não tem problema! A certa era {answer} 😊"
];

const gameState = {
  avatar: window.AvatarCreator.cloneDefaultAvatar(),
  difficulty: "facil",
  questions: [],
  currentQuestionIndex: 0,
  score: 0,
  hasAnswered: false,
  isModalOpen: false
};

const elements = {
  screens: document.querySelectorAll(".screen"),
  characterName: document.querySelector("#character-name"),
  skinOptions: document.querySelector("#skin-options"),
  eyeOptions: document.querySelector("#eye-options"),
  hairStyleOptions: document.querySelector("#hair-style-options"),
  hairColorOptions: document.querySelector("#hair-color-options"),
  outfitOptions: document.querySelector("#outfit-options"),
  previewName: document.querySelector("#preview-name"),
  modalPreviewName: document.querySelector("#modal-preview-name"),
  avatarPreviewLobby: document.querySelector("#avatar-preview-lobby"),
  avatarPreviewLarge: document.querySelector("#avatar-preview-large"),
  avatarPreviewQuiz: document.querySelector("#avatar-preview-quiz"),
  avatarPreviewResult: document.querySelector("#avatar-preview-result"),
  customizeModal: document.querySelector("#customize-modal"),
  customizeOpenButton: document.querySelector("#customize-open-button"),
  customizeDoneButton: document.querySelector("#customize-done-button"),
  customizeCloseX: document.querySelector("#customize-close-x"),
  difficultyButtons: document.querySelectorAll("[data-difficulty]"),
  quizPlayerName: document.querySelector("#quiz-player-name"),
  quizDifficultyName: document.querySelector("#quiz-difficulty-name"),
  questionCounter: document.querySelector("#question-counter"),
  scoreCounter: document.querySelector("#score-counter"),
  questionImage: document.querySelector("#question-image"),
  imageFallback: document.querySelector("#image-fallback"),
  quizQuestion: document.querySelector("#quiz-question"),
  answersGrid: document.querySelector("#answers-grid"),
  feedbackBox: document.querySelector("#feedback-box"),
  nextQuestionButton: document.querySelector("#next-question-button"),
  resultTitle: document.querySelector("#result-title"),
  resultPlayerName: document.querySelector("#result-player-name"),
  resultScore: document.querySelector("#result-score"),
  resultPoints: document.querySelector("#result-points"),
  resultMessage: document.querySelector("#result-message"),
  resultSeal: document.querySelector("#result-seal"),
  playAgainButton: document.querySelector("#play-again-button"),
  backHomeButton: document.querySelector("#back-home-button")
};

Object.assign(elements, {
  quizHomeButton: document.querySelector("#quiz-home-button"),
  listenButton: document.querySelector("#listen-button"),
  questionTopic: document.querySelector("#question-topic"),
  journeyTrack: document.querySelector("#journey-track"),
  journeyFill: document.querySelector("#journey-fill"),
  imageStatus: document.querySelector("#image-status"),
  confetti: document.querySelector("#confetti")
});

function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  elements.listenButton.textContent = "♫ Ouvir pergunta";
}

function listenToQuestion() {
  if (!("speechSynthesis" in window) || !getCurrentQuestion()) return;
  stopSpeaking();
  const options = [...elements.answersGrid.querySelectorAll(".answer-button")]
    .map((button, index) => `Opção ${index + 1}: ${button.dataset.answer}.`).join(" ");
  const utterance = new SpeechSynthesisUtterance(`${getCurrentQuestion().texto} ${options}`);
  utterance.lang = "pt-BR";
  utterance.rate = 0.85;
  const voice = window.speechSynthesis.getVoices().find((item) => item.lang === "pt-BR");
  if (voice) utterance.voice = voice;
  elements.listenButton.textContent = "♫ Ouvir de novo";
  window.speechSynthesis.speak(utterance);
}

function updateProgress() {
  const answered = gameState.currentQuestionIndex + Number(gameState.hasAnswered);
  const total = gameState.questions.length;
  elements.journeyFill.style.width = `${total ? answered / total * 100 : 0}%`;
  elements.journeyTrack.setAttribute("aria-valuenow", String(answered));
  elements.journeyTrack.setAttribute("aria-valuemax", String(total));
  elements.journeyTrack.setAttribute("aria-valuetext", `${answered} de ${total} perguntas respondidas`);
}

function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  elements.confetti.replaceChildren();
  const colors = ["#9873db", "#f4bd48", "#6cb992", "#ee93a7", "#79c8dd"];
  for (let index = 0; index < 35; index += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colors[index % colors.length];
    piece.style.animationDelay = `${Math.random() * .5}s`;
    elements.confetti.appendChild(piece);
  }
  setTimeout(() => elements.confetti.replaceChildren(), 3000);
}

function showScreen(screenId) {
  stopSpeaking();
  elements.screens.forEach((screen) => {
    screen.classList.toggle("screen--active", screen.id === screenId);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  const title = document.querySelector(`#${screenId} h1, #${screenId} h2`);
  if (title) title.focus({ preventScroll: true });
}

function shuffleArray(items) {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function getRandomItem(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

function findOptionByValue(collection, value) {
  return collection.find((item) => item.value === value || item.id === value) || collection[0];
}

function createColorButton({ option, groupName, isSelected }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice choice--color";
  button.dataset.group = groupName;
  button.dataset.value = option.value;
  button.setAttribute("aria-label", option.label);
  button.setAttribute("aria-pressed", String(isSelected));
  button.style.setProperty("--choice-color", option.value);

  const label = document.createElement("span");
  label.textContent = option.label;
  button.appendChild(label);

  return button;
}

function createTextChoiceButton({ option, groupName, isSelected }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice choice--text";
  button.dataset.group = groupName;
  button.dataset.value = option.id;
  button.setAttribute("aria-pressed", String(isSelected));
  button.textContent = option.label;

  return button;
}

function createOutfitButton({ outfit, isSelected }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice choice--outfit";
  button.dataset.group = "outfit";
  button.dataset.value = outfit.id;
  button.setAttribute("aria-pressed", String(isSelected));
  button.style.setProperty("--outfit-color", outfit.primary);

  button.innerHTML = `
    <span class="outfit-dot">${outfit.emoji}</span>
    <span>${outfit.label}</span>
  `;

  return button;
}

function renderAvatarChoices() {
  const options = window.AvatarCreator.options;

  elements.skinOptions.innerHTML = "";
  options.skinColors.forEach((option) => {
    elements.skinOptions.appendChild(
      createColorButton({
        option,
        groupName: "skinColor",
        isSelected: option.value === gameState.avatar.skinColor
      })
    );
  });

  elements.eyeOptions.innerHTML = "";
  options.eyeColors.forEach((option) => {
    elements.eyeOptions.appendChild(
      createColorButton({
        option,
        groupName: "eyeColor",
        isSelected: option.value === gameState.avatar.eyeColor
      })
    );
  });

  elements.hairStyleOptions.innerHTML = "";
  options.hairStyles.forEach((option) => {
    elements.hairStyleOptions.appendChild(
      createTextChoiceButton({
        option,
        groupName: "hairStyle",
        isSelected: option.id === gameState.avatar.hairStyle
      })
    );
  });

  elements.hairColorOptions.innerHTML = "";
  options.hairColors.forEach((option) => {
    elements.hairColorOptions.appendChild(
      createColorButton({
        option,
        groupName: "hairColor",
        isSelected: option.value === gameState.avatar.hairColor
      })
    );
  });

  elements.outfitOptions.innerHTML = "";
  options.outfits.forEach((outfit) => {
    elements.outfitOptions.appendChild(
      createOutfitButton({
        outfit,
        isSelected: outfit.id === gameState.avatar.outfit.id
      })
    );
  });
}

function updateChoiceState(groupName, selectedValue) {
  const buttons = document.querySelectorAll(`[data-group='${groupName}']`);

  buttons.forEach((button) => {
    const isSelected = button.dataset.value === selectedValue;
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

function syncAvatarNameFromInput() {
  gameState.avatar.name = window.AvatarCreator.normalizeName(elements.characterName.value);
}

function renderAvatarDisplays() {
  syncAvatarNameFromInput();

  elements.previewName.textContent = gameState.avatar.name;
  elements.modalPreviewName.textContent = gameState.avatar.name;
  elements.quizPlayerName.textContent = gameState.avatar.name;
  elements.resultPlayerName.textContent = gameState.avatar.name;

  elements.avatarPreviewLobby.innerHTML = window.AvatarCreator.createAvatarMarkup(gameState.avatar, "avatar--home");
  elements.avatarPreviewLarge.innerHTML = window.AvatarCreator.createAvatarMarkup(gameState.avatar, "avatar--modal");
  elements.avatarPreviewQuiz.innerHTML = window.AvatarCreator.createAvatarMarkup(gameState.avatar, "avatar--tiny");
  elements.avatarPreviewResult.innerHTML = window.AvatarCreator.createAvatarMarkup(gameState.avatar, "avatar--result");
}

function handleAvatarChoice(event) {
  const button = event.target.closest("[data-group]");

  if (!button) {
    return;
  }

  const groupName = button.dataset.group;
  const value = button.dataset.value;
  const options = window.AvatarCreator.options;

  if (groupName === "outfit") {
    gameState.avatar.outfit = options.outfits.find((outfit) => outfit.id === value) || options.outfits[0];
  } else {
    gameState.avatar[groupName] = value;
  }

  updateChoiceState(groupName, value);
  renderAvatarDisplays();
}

function openCustomizeModal() {
  gameState.isModalOpen = true;
  elements.customizeModal.classList.add("is-open");
  elements.customizeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelectorAll(".brand-header, .screen--active").forEach((node) => { node.inert = true; });
  elements.characterName.focus();
}

function closeCustomizeModal() {
  gameState.isModalOpen = false;
  renderAvatarDisplays();
  elements.customizeModal.classList.remove("is-open");
  elements.customizeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  document.querySelectorAll(".brand-header, .screen").forEach((node) => { node.inert = false; });
  elements.customizeOpenButton.focus();
}

function prepareQuestionImage(question) {
  elements.questionImage.onload = () => {
    elements.questionImage.classList.remove("is-hidden");
    elements.imageFallback.classList.remove("image-fallback--visible");
    elements.imageFallback.setAttribute("aria-hidden", "true");
  };

  elements.questionImage.onerror = () => {
    elements.questionImage.classList.add("is-hidden");
    elements.imageFallback.classList.add("image-fallback--visible");
    elements.imageFallback.setAttribute("aria-hidden", "false");
    elements.imageStatus.textContent = "A imagem não abriu. Volte ao início e tente de novo com a ajuda de um adulto.";
  };

  elements.questionImage.classList.add("is-hidden");
  elements.imageFallback.classList.add("image-fallback--visible");
  elements.imageFallback.setAttribute("aria-hidden", "false");
  elements.imageStatus.textContent = "Carregando a próxima descoberta…";
  elements.questionImage.classList.toggle("image--letters", question.id === 17);
  elements.questionImage.alt = `Ilustração da atividade: ${question.texto}`;
  elements.questionImage.src = question.imagem;
}

function getCurrentQuestion() {
  return gameState.questions[gameState.currentQuestionIndex];
}

function clearFeedback() {
  elements.feedbackBox.hidden = true;
  elements.feedbackBox.className = "feedback-box";
  elements.feedbackBox.textContent = "";
}

function showFeedback({ isCorrect, correctAnswer }) {
  const message = isCorrect
    ? getRandomItem(CORRECT_FEEDBACK_MESSAGES)
    : getRandomItem(WRONG_FEEDBACK_MESSAGES).replace("{answer}", correctAnswer);

  elements.feedbackBox.hidden = false;
  elements.feedbackBox.className = `feedback-box ${isCorrect ? "feedback-box--correct" : "feedback-box--wrong"}`;
  elements.feedbackBox.textContent = `${message} ${getCurrentQuestion().explicacao}`;
}

function renderQuestion() {
  stopSpeaking();
  const question = getCurrentQuestion();
  const totalQuestions = gameState.questions.length;
  const questionNumber = gameState.currentQuestionIndex + 1;
  const alternatives = shuffleArray(question.alternativas[gameState.difficulty]);

  gameState.hasAnswered = false;
  elements.quizQuestion.textContent = question.texto;
  elements.questionTopic.textContent = question.tema;
  elements.questionCounter.textContent = `Pergunta ${questionNumber} de ${totalQuestions}`;
  elements.scoreCounter.textContent = `⭐ ${gameState.score} ${gameState.score === 1 ? "estrela" : "estrelas"}`;
  elements.nextQuestionButton.disabled = true;
  elements.nextQuestionButton.textContent = questionNumber === totalQuestions ? "Ver minhas descobertas ✦" : "Próxima descoberta →";
  elements.answersGrid.innerHTML = "";
  clearFeedback();

  prepareQuestionImage(question);

  alternatives.forEach((alternative, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    const marker = document.createElement("span");
    marker.className = "answer-letter";
    marker.textContent = String.fromCharCode(65 + index);
    marker.setAttribute("aria-hidden", "true");
    const label = document.createElement("span");
    label.className = "answer-text";
    label.textContent = alternative;
    button.append(marker, label);
    button.dataset.answer = alternative;
    button.addEventListener("click", () => handleAnswer(button, question));
    elements.answersGrid.appendChild(button);
  });
  updateProgress();
  elements.quizQuestion.focus({ preventScroll: true });
}

function handleAnswer(selectedButton, question) {
  if (gameState.hasAnswered) {
    return;
  }

  gameState.hasAnswered = true;
  stopSpeaking();
  const selectedAnswer = selectedButton.dataset.answer;
  const isCorrect = selectedAnswer === question.correta;

  if (isCorrect) {
    gameState.score += 1;
  }

  elements.scoreCounter.textContent = `⭐ ${gameState.score} ${gameState.score === 1 ? "estrela" : "estrelas"}`;
  elements.nextQuestionButton.disabled = false;
  showFeedback({ isCorrect, correctAnswer: question.correta });

  const answerButtons = elements.answersGrid.querySelectorAll(".answer-button");
  answerButtons.forEach((button) => {
    button.disabled = true;

    if (button.dataset.answer === question.correta) {
      button.classList.add("answer-button--correct");
      button.querySelector(".answer-letter").textContent = "✓";
      button.setAttribute("aria-label", `${button.dataset.answer}. Resposta correta.`);
    }

    if (!isCorrect && button === selectedButton) {
      button.classList.add("answer-button--wrong");
      button.querySelector(".answer-letter").textContent = "↻";
      button.setAttribute("aria-label", `${button.dataset.answer}. Vamos aprender com essa tentativa.`);
    }
  });
  updateProgress();
  elements.nextQuestionButton.focus({ preventScroll: true });
}

function resetCurrentMatch() {
  gameState.questions = [];
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.hasAnswered = false;
  elements.answersGrid.innerHTML = "";
  clearFeedback();
  elements.nextQuestionButton.disabled = true;
}

function startQuiz(difficulty) {
  syncAvatarNameFromInput();
  gameState.difficulty = difficulty;
  gameState.questions = shuffleArray(window.QUIZ_QUESTIONS);
  gameState.currentQuestionIndex = 0;
  gameState.score = 0;
  gameState.hasAnswered = false;

  renderAvatarDisplays();
  elements.quizDifficultyName.textContent = `Modo ${DIFFICULTY_LABELS[difficulty]}`;
  showScreen("screen-quiz");
  renderQuestion();
}

function goToNextQuestion() {
  if (!gameState.hasAnswered) {
    return;
  }

  gameState.currentQuestionIndex += 1;

  if (gameState.currentQuestionIndex >= gameState.questions.length) {
    showResult();
    return;
  }

  renderQuestion();
}

function getResultData(score) {
  const ratio = score / gameState.questions.length;
  if (ratio < 0.5) {
    return {
      title: "Você tentou direitinho! 🌈",
      seal: "🌈",
      message: "Cada tentativa é uma nova descoberta. Vamos brincar de novo e aprender mais um pouquinho?"
    };
  }

  if (ratio < 0.8) {
    return {
      title: "Você foi muito bem! 😊",
      seal: "😊",
      message: "Você descobriu um montão de coisas! Continue explorando esse mundo de cores, letras e animais."
    };
  }

  return {
    title: "Parabéns! Você arrasou! 🎉",
    seal: "🎉",
    message: "Que explorador incrível! Você observou, pensou e fez muitas descobertas. Continue com essa curiosidade!"
  };
}

function showResult() {
  const totalQuestions = gameState.questions.length;
  const resultData = getResultData(gameState.score);

  elements.resultTitle.textContent = resultData.title;
  elements.resultSeal.textContent = resultData.seal;
  elements.resultScore.textContent = `Você acertou ${gameState.score} de ${totalQuestions} perguntas`;
  elements.resultPoints.textContent = `⭐ ${gameState.score} ${gameState.score === 1 ? "estrela conquistada" : "estrelas conquistadas"} • Modo ${DIFFICULTY_LABELS[gameState.difficulty]}`;
  elements.resultMessage.textContent = resultData.message;
  renderAvatarDisplays();
  showScreen("screen-result");
  celebrate();
}

function goToLobby() {
  elements.confetti.replaceChildren();
  resetCurrentMatch();
  renderAvatarDisplays();
  showScreen("screen-lobby");
}

function bindEvents() {
  elements.characterName.addEventListener("input", renderAvatarDisplays);
  elements.skinOptions.addEventListener("click", handleAvatarChoice);
  elements.eyeOptions.addEventListener("click", handleAvatarChoice);
  elements.hairStyleOptions.addEventListener("click", handleAvatarChoice);
  elements.hairColorOptions.addEventListener("click", handleAvatarChoice);
  elements.outfitOptions.addEventListener("click", handleAvatarChoice);

  elements.customizeOpenButton.addEventListener("click", openCustomizeModal);
  elements.customizeDoneButton.addEventListener("click", closeCustomizeModal);
  elements.customizeCloseX.addEventListener("click", closeCustomizeModal);

  elements.customizeModal.addEventListener("click", (event) => {
    if (event.target === elements.customizeModal) {
      closeCustomizeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && gameState.isModalOpen) {
      closeCustomizeModal();
    }
    if (event.key === "Tab" && gameState.isModalOpen) {
      const focusable = [...elements.customizeModal.querySelectorAll("button, input")].filter((node) => !node.disabled);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  elements.difficultyButtons.forEach((button) => {
    button.addEventListener("click", () => startQuiz(button.dataset.difficulty));
  });

  elements.nextQuestionButton.addEventListener("click", goToNextQuestion);
  elements.playAgainButton.addEventListener("click", () => startQuiz(gameState.difficulty));
  elements.backHomeButton.addEventListener("click", goToLobby);
  elements.quizHomeButton.addEventListener("click", goToLobby);
  elements.listenButton.addEventListener("click", listenToQuestion);
  document.querySelector("#avatar-form").addEventListener("submit", (event) => { event.preventDefault(); closeCustomizeModal(); });
  window.addEventListener("pagehide", stopSpeaking);
}

function init() {
  if (!Array.isArray(window.QUIZ_QUESTIONS) || window.QUIZ_QUESTIONS.length === 0) {
    elements.quizQuestion.textContent = "As perguntas não foram encontradas.";
    return;
  }

  const options = window.AvatarCreator.options;
  gameState.avatar.skinColor = findOptionByValue(options.skinColors, gameState.avatar.skinColor).value;
  gameState.avatar.eyeColor = findOptionByValue(options.eyeColors, gameState.avatar.eyeColor).value;
  gameState.avatar.hairColor = findOptionByValue(options.hairColors, gameState.avatar.hairColor).value;
  gameState.avatar.outfit = options.outfits[0];

  renderAvatarChoices();
  renderAvatarDisplays();
  bindEvents();
  if (!("speechSynthesis" in window)) {
    elements.listenButton.disabled = true;
    elements.listenButton.textContent = "Áudio indisponível";
    elements.listenButton.title = "Este navegador não oferece leitura em voz alta.";
  }
}

document.addEventListener("DOMContentLoaded", init);
