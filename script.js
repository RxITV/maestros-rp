document.addEventListener("DOMContentLoaded", function () {
    let schedule = JSON.parse(localStorage.getItem("schedule")) || [];
    const taskInput = document.getElementById("task");
    const timeInput = document.getElementById("time");
    const dayInput = document.getElementById("day");
    const gradeInput = document.getElementById("task-grade");
    const optionalInput = document.getElementById("task-optional");
    const numberInput = document.getElementById("task-number");
    const scheduleList = document.getElementById("schedule-list");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    for (let i = 101; i <= 199; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        numberInput.appendChild(option);
    }

    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    darkModeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("dark-mode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
    });

    function saveTasks() {
        localStorage.setItem("schedule", JSON.stringify(schedule));
    }

    function renderSchedule() {
        scheduleList.innerHTML = "";
        schedule.sort((a, b) => {
            const daysOrder = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
            return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day) || a.time.localeCompare(b.time);
        });

        schedule.forEach((item, index) => {
            let gradeOptionalText = "";
            if (item.grade || item.optional) {
                const elements = [];
                if (item.grade) elements.push(item.grade);
                if (item.optional) elements.push(item.optional);
                gradeOptionalText = `[${elements.join(", ")}]`;
            }

            scheduleList.innerHTML += `
                <li class="task-item">
                    <span class="task-text">
                        <strong>${item.day} - ${item.time}</strong> : ${item.task} 
                        ${gradeOptionalText} (${item.number})
                    </span>
                    <button class="delete-btn" onclick="removeTask(${index})">🗑️</button>
                </li>`;
        });
    }

    window.addTask = function () {
        const task = taskInput.value.trim();
        const time = timeInput.value;
        const day = dayInput.value;
        const grade = gradeInput.value || null;
        const optional = optionalInput.value || null;
        const number = numberInput.value;

        if (task && time && day && number) {
            schedule.push({ task, time, day, grade, number, optional });
            saveTasks();
            renderSchedule();
        }
    };

    window.removeTask = function (index) {
        schedule.splice(index, 1);
        saveTasks();
        renderSchedule();
    };

    window.editEmbed = function () {
        let newTitle = prompt("📝 Entrez le nouveau titre du calendrier :", "📅 Formations de la semaine");
        if (newTitle === null) return;

        let newColor = prompt("🎨 Entrez la couleur HEX (ex: #3498db pour bleu) :", "#3498db");
        if (newColor === null) return;

        let colorInt = parseInt(newColor.replace("#", ""), 16);
        localStorage.setItem("embedTitle", newTitle);
        localStorage.setItem("embedColor", colorInt);

        alert("✅ Le calendrier a été mis à jour !");
    };

    window.updateSchedule = function () {
        renderSchedule();
        updateDiscordEmbed(); // ✅ Met à jour l'embed existant sans en créer un nouveau
        alert("✅ Calendrier et embed mis à jour !");
    };

    // ✅ Fonction pour modifier l'embed existant sur Discord
function updateDiscordEmbed() {
    const webhookURL = "https://discord.com/api/webhooks/1335295354509197413/pdlrLBeuaTrvHsXPM0fiJCbluNS6fd_hesKlf0pUvrmtruG4DQo9qhe2wzwE--6ef6uI"; // 🔴 Mets ici ton Webhook Discord
    const messageID = "1335302993192419421"; // 🔴 Mets ici l'ID du message envoyé sur Discord

    if (!webhookURL || !messageID) {
        alert("❌ Webhook Discord ou ID du message non configuré !");
        return;
    }

    if (schedule.length === 0) {
        alert("❌ Aucune tâche à envoyer !");
        return;
    }

    let embedTitle = localStorage.getItem("embedTitle") || "📅 Calendrier des Formations";
    let embedColor = parseInt(localStorage.getItem("embedColor")) || 3447003; // Bleu par défaut

    let embedFields = [];

    schedule.forEach((item) => {
        let details = `**Formation :** ${item.task}\n`;
        if (item.grade) details += `**Grade :** ${item.grade}\n`;
        if (item.optional) details += `**Unité :** ${item.optional}\n`;
        details += `**Matricule :** ${item.number}`;

        embedFields.push({
            name: `🕒 ${item.day} - ${item.time}`,
            value: details,
            inline: false
        });
    });

    const embed = {
        embeds: [{
            title: embedTitle,
            color: embedColor,
            fields: embedFields,
            footer: {
                text: "Mis à jour automatiquement",
                icon_url: "https://cdn-icons-png.flaticon.com/512/929/929564.png"
            },
            timestamp: new Date().toISOString()
        }]
    };

    fetch(`${webhookURL}/messages/${messageID}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed),
    })
    .then(response => {
        if (response.ok) {
            console.log("✅ Embed mis à jour sur Discord !");
        } else {
            console.error("❌ Erreur lors de la mise à jour de l'embed !");
        }
    })
    .catch(error => {
        console.error("Erreur Webhook :", error);
    });
}




document.getElementById("test-button").addEventListener("click", addRandomTask);

function addRandomTask() {
    const randomTasks = ["Formation Tactique", "Cours de Conduite", "Entraînement SWAT", "Premiers Secours"];
    const randomTimes = ["08:00", "10:30", "14:15", "17:45", "20:00"];
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const grades = ["Junior", "Adjoint", "Sergent", "Lieutenant", "Sheriff"];
    const units = ["SWAT", "GND", "Haut Gradé"];

    const task = randomTasks[Math.floor(Math.random() * randomTasks.length)];
    const time = randomTimes[Math.floor(Math.random() * randomTimes.length)];
    const day = days[Math.floor(Math.random() * days.length)];
    const number = Math.floor(Math.random() * (199 - 101 + 1)) + 101;

    const includeGrade = Math.random() > 0.5;
    const includeUnit = Math.random() > 0.5;

    const grade = includeGrade ? grades[Math.floor(Math.random() * grades.length)] : null;
    const optional = includeUnit ? units[Math.floor(Math.random() * units.length)] : null;

    schedule.push({ task, time, day, grade, number, optional });
    saveTasks();
    renderSchedule();
}





window.sendToDiscord = function () {
        const webhookURL = "https://discord.com/api/webhooks/1335295354509197413/pdlrLBeuaTrvHsXPM0fiJCbluNS6fd_hesKlf0pUvrmtruG4DQo9qhe2wzwE--6ef6uI"; // 🔴 Mets ici ton Webhook Discord
    
        if (!webhookURL) {
            alert("❌ Webhook Discord non configuré !");
            return;
        }
    
        if (schedule.length === 0) {
            alert("❌ Aucune tâche à envoyer !");
            return;
        }
    
        // ✅ Récupérer les valeurs enregistrées pour le titre et la couleur
        let embedTitle = localStorage.getItem("embedTitle") || "📅 Calendrier des Formations";
        let embedColor = parseInt(localStorage.getItem("embedColor")) || 3447003; // Bleu par défaut
    
        let embedFields = [];
    
        schedule.forEach((item) => {
            let details = `**Formation :** ${item.task}\n`; // ✅ Tâche toujours affichée
            
            if (item.grade) details += `**Grade :** ${item.grade}\n`; // ✅ Grade sur une ligne en dessous
            if (item.optional) details += `**Unité :** ${item.optional}\n`; // ✅ Optionnel sur une ligne en dessous
            
            details += `**Matricule :** ${item.number}`; // ✅ Numéro en bas
    
            embedFields.push({
                name: `🕒 ${item.day} - ${item.time}`,
                value: details,
                inline: false
            });
        });
    
        const embed = {
            username: "Calendrier",
            avatar_url: "https://cdn-icons-png.flaticon.com/512/2922/2922510.png", // Icône personnalisable
            embeds: [{
                title: embedTitle, // ✅ Utilisation du titre personnalisé
                color: embedColor, // ✅ Utilisation de la couleur personnalisée
                fields: embedFields,
                footer: {
                    text: "Envoyé automatiquement depuis l'emploi du temps",
                    icon_url: "https://cdn-icons-png.flaticon.com/512/929/929564.png"
                },
                timestamp: new Date().toISOString()
            }]
        };
    
        fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(embed),
        })
        .then(response => {
            if (response.ok) {
                alert("✅ Calendrier envoyé sur Discord !");
            } else {
                alert("❌ Erreur lors de l'envoi !");
            }
        })
        .catch(error => {
            console.error("Erreur Webhook :", error);
            alert("❌ Impossible d'envoyer le message !");
        });
    };

    renderSchedule();
});
