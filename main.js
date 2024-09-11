// main.js

// Kontrollera om webbläsaren stödjer Web Speech API
console.log('Web Speech API är tillgängligt:', ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window));

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'sv-SE';  // Ställ in språk till svenska
    recognition.continuous = true;  // Fortsätt att lyssna efter att tal har identifierats
    recognition.interimResults = false;  // Visa endast slutresultat

    // Variabel för att hålla koll på antalet gånger en fras sägs
    let count = 0;
    const phraseToCount = "nigger";  // Frasen att spåra
    const resultText = document.getElementById('result-text');
    const countDisplay = document.getElementById('count');
    const statusText = document.getElementById('status');
    const startBtn = document.getElementById('start-btn');

    // Kontrollera om resultText existerar
    if (!resultText) {
        console.error('Elementet med id="result-text" finns inte på sidan.');
    }

    // Kontrollera om countDisplay existerar
    if (!countDisplay) {
        console.error('Elementet med id="count" finns inte på sidan.');
    }

    // Kontrollera om statusText existerar
    if (!statusText) {
        console.error('Elementet med id="status" finns inte på sidan.');
    }

    // Kontrollera om startBtn existerar
    if (!startBtn) {
        console.error('Elementet med id="start-btn" finns inte på sidan.');
    }

    // Starta eller stoppa röstigenkänning när användaren klickar på knappen
    startBtn.addEventListener('click', () => {
        if (recognition.started) {
            recognition.stop();
            startBtn.textContent = "Starta Röstigenkänning";
            statusText.textContent = "Inaktiv";
            statusText.classList.remove('status-on');
            statusText.classList.add('status-off');
            console.log("Röstigenkänning stoppad.");
        } else {
            recognition.start();
            startBtn.textContent = "Stoppa Röstigenkänning";
            statusText.textContent = "Aktiv";
            statusText.classList.remove('status-off');
            statusText.classList.add('status-on');
            console.log("Röstigenkänning startad.");
        }
        recognition.started = !recognition.started;  // Växla tillståndet
    });

    // Hantera resultat från röstigenkänning
    recognition.onresult = (event) => {
        const speechResult = event.results[event.resultIndex][0].transcript.toLowerCase();
        console.log("Du sa:", speechResult);  // Visa vad som sägs i konsolen

        // Uppdatera resultatet i HTML om elementet finns
        if (resultText) {
            resultText.textContent = speechResult;
        }

        // Om frasen matchar det vi letar efter
        if (speechResult.includes(phraseToCount)) {
            console.log(`Frasen "${phraseToCount}" identifierades!`);
            count++;
            // Uppdatera endast om countDisplay existerar
            if (countDisplay) {
                countDisplay.textContent = count;
            }
        } else {
            console.log(`Frasen "${phraseToCount}" hittades inte.`);
        }
    };

    // Hantera slut av röstigenkänning
    recognition.onend = () => {
        if (recognition.started) {
            // Om röstigenkänningen är aktiv, starta om den
            recognition.start();
        }
        // Annars, lämna knappen i det stoppade tillståndet
        console.log("Röstigenkänning slut.");
    };

    // Hantera fel
    recognition.onerror = (event) => {
        console.error("Fel med röstigenkänning:", event.error);
        alert("Röstigenkänning fel: " + event.error);
        if (recognition.started) {
            recognition.stop();
            startBtn.textContent = "Starta Röstigenkänning";
            statusText.textContent = "Fel";
            statusText.classList.remove('status-on');
            statusText.classList.add('status-off');
        }
    };

    // Initiera start-knappen som inaktiv
    recognition.started = false;

} else {
    console.log("Webbläsaren stödjer inte Web Speech API.");
}
