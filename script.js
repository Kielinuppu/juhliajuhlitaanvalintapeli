document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('startScreen');
    const gameScreen = document.getElementById('gameScreen');
    const endScreen = document.getElementById('endScreen');
    const startButton = document.getElementById('startButton');
    const playAgainButton = document.getElementById('playAgainButton');
    const question = document.getElementById('question');
    const juhlaImage = document.getElementById('juhlaImage');
    const trueButton = document.getElementById('trueButton');
    const falseButton = document.getElementById('falseButton');
    const stars = document.getElementById('stars');
    const finalStars = document.getElementById('finalStars');
    const finalFeedback = document.getElementById('finalFeedback');
    const scoreText = document.getElementById('scoreText');
    const nextArrow = document.getElementById('nextArrow');

    const statements = [
        "JOULUKUUSI KORISTELLAAN PÄÄSIÄISENÄ",      // 0
        "JOULUKUUSI KORISTELLAAN JOULUNA",          // 1
        "SIMAA JUODAAN VAPPUNA",                    // 2
        "SIMAA JUODAAN LASKIAISENA",                // 3
        "RAIRUOHO KASVATETAAN PÄÄSIÄISENÄ",         // 4
        "RAIRUOHO KASVATETAAN JUHANNUKSENA",        // 5
        "KOKKO POLTETAAN JOULUNA",                  // 6
        "KOKKO POLTETAAN JUHANNUKSENA",             // 7
        "LAHJOJA ANNETAAN SYNTYMÄPÄIVÄNÄ",          // 8
        "LAHJOJA ANNETAAN LASKIAISENA",             // 9
        "RAKETTEJA AMMUTAAN UUTENAVUOTENA",         // 10
        "RAKETTEJA AMMUTAAN PÄÄSIÄISENÄ",           // 11
        "PULKALLA LASKETAAN LASKIAISENA",           // 12
        "PULKALLA LASKETAAN JUHANNUKSENA"           // 13
    ];

    const imageMap = {
        0: 'joulukuusi',
        1: 'joulukuusi',
        2: 'sima',
        3: 'sima',
        4: 'rairuoho',
        5: 'rairuoho',
        6: 'kokko',
        7: 'kokko',
        8: 'paketti',
        9: 'paketti',
        10: 'ilotulitus',
        11: 'ilotulitus',
        12: 'pulkka',
        13: 'pulkka'
    };

    const correctStatements = [1, 2, 4, 7, 8, 10, 12];

    let currentRound = 0;
    let score = 0;
    let gameQuestions = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startGame() {
        startScreen.classList.add('hidden');
        endScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        currentRound = 0;
        score = 0;
        stars.innerHTML = '';
        gameQuestions = generateQuestions();
        loadQuestionContent(gameQuestions[currentRound]);
        playAudio('avaiv.mp3', () => {
            playQuestionAudio();
        });
    }

    function generateQuestions() {
        let questions = [];
        let trueCount = 0;
        
        // Valitaan 3 oikeaa väitettä
        while (trueCount < 3) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
                trueCount++;
            }
        }
        
        // Valitaan 2 väärää väitettä
        while (questions.length < 5) {
            let index = Math.floor(Math.random() * statements.length);
            if (!questions.some(q => q.statementIndex === index) && 
                !correctStatements.includes(index)) {
                questions.push({ 
                    statementIndex: index,
                    imageIndex: index
                });
            }
        }
        
        shuffleArray(questions);
        return questions;
    }

    function loadQuestionContent(question) {
        const { statementIndex } = question;
        juhlaImage.src = `${imageMap[statementIndex]}.png`;
        juhlaImage.style.display = 'block';
        this.question.textContent = statements[statementIndex];
        nextArrow.classList.add('hidden');
        trueButton.disabled = false;
        falseButton.disabled = false;
    }

    function playQuestionAudio() {
        const { statementIndex } = gameQuestions[currentRound];
        const audioMap = {
            0: 'joulukuusi_paasiainen',
            1: 'joulukuusi_joulu',
            2: 'sima_vappu',
            3: 'sima_laskiainen',
            4: 'rairuoho_paasiainen',
            5: 'rairuoho_juhannus',
            6: 'kokko_joulu',
            7: 'kokko_juhannus',
            8: 'lahja_synttarit',
            9: 'lahja_laskiainen',
            10: 'raketti_uusivuosi',
            11: 'raketti_paasiainen',
            12: 'pulkka_laskiainen',
            13: 'pulkka_juhannus'
        };
        
        playAudio(`${audioMap[statementIndex]}.mp3`);
    }

    function nextQuestion() {
        if (currentRound < 4) {
            currentRound++;
            loadQuestionContent(gameQuestions[currentRound]);
            playQuestionAudio();
        } else {
            endGame();
        }
    }

    function checkAnswer(isTrue) {
        const { statementIndex } = gameQuestions[currentRound];
        const correctAnswer = correctStatements.includes(statementIndex);
        if ((isTrue && correctAnswer) || (!isTrue && !correctAnswer)) {
            score++;
            playAudio('oikein.mp3');
            addStar();
        } else {
            playAudio('vaarin.mp3');
        }
        trueButton.disabled = true;
        falseButton.disabled = true;
        if (currentRound < 4) {
            nextArrow.classList.remove('hidden');
        } else {
            setTimeout(endGame, 1000);
        }
    }

    function addStar() {
        const star = document.createElement('img');
        star.src = 'tahti.png';
        star.classList.add('star');
        stars.appendChild(star);
    }
    
    function endGame() {
        gameScreen.classList.add('hidden');
        endScreen.classList.remove('hidden');
        finalStars.innerHTML = '';
        for (let i = 0; i < score; i++) {
            const star = document.createElement('img');
            star.src = 'tahti.png';
            star.classList.add('star');
            finalStars.appendChild(star);
        }
        finalFeedback.textContent = 'HIENOA!';
        scoreText.textContent = `${score}/5 OIKEIN`;
    }

    function playAudio(filename, callback) {
        const audio = new Audio(filename);
        audio.play();
        if (callback) {
            audio.onended = callback;
        }
    }

    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    trueButton.addEventListener('click', () => checkAnswer(true));
    falseButton.addEventListener('click', () => checkAnswer(false));
    nextArrow.addEventListener('click', nextQuestion);
});