// Wait for the DOM to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to HTML elements
    const numTeamsInput = document.getElementById('numTeams');
    const setTeamsButton = document.getElementById('setTeams');
    const teamInputsContainer = document.getElementById('teamInputs');
    const generateScheduleButton = document.getElementById('generateSchedule');
    const scheduleOutput = document.getElementById('scheduleOutput');
    const roundsContainer = document.getElementById('rounds');
    const saveScheduleButton = document.getElementById('saveSchedule');
    const printScheduleButton = document.getElementById('printSchedule');
    
    // Event listener for setting the number of teams
    setTeamsButton.addEventListener('click', function() {
        const numTeams = parseInt(numTeamsInput.value);
        
        if (numTeams < 2) {
            alert('Please enter at least 2 teams for a round robin tournament.');
            return;
        }
        
        // Generate input fields for team names
        createTeamInputs(numTeams);
    });
    
    // Function to create input fields for team names
    function createTeamInputs(numTeams) {
        teamInputsContainer.innerHTML = '';
        
        for (let i = 1; i <= numTeams; i++) {
            const teamInput = document.createElement('div');
            teamInput.className = 'team-input';
            
            teamInput.innerHTML = `
                <label for="team${i}">Team/Participant ${i}:</label>
                <input type="text" id="team${i}" placeholder="Enter name" value="Team ${i}">
            `;
            
            teamInputsContainer.appendChild(teamInput);
        }
    }
    
    // Event listener for generating the round robin schedule
    generateScheduleButton.addEventListener('click', function() {
        const numTeams = parseInt(numTeamsInput.value);
        
        if (numTeams < 2) {
            alert('Please enter at least 2 teams for a round robin tournament.');
            return;
        }
        
        // Collect team names from input fields
        const teams = [];
        for (let i = 1; i <= numTeams; i++) {
            const teamName = document.getElementById(`team${i}`).value.trim();
            teams.push(teamName || `Team ${i}`);
        }
        
        // Generate round robin schedule
        const schedule = generateRoundRobin(teams);
        
        // Display the schedule
        displaySchedule(schedule);
        
        // Show the schedule output section
        scheduleOutput.style.display = 'block';
    });
    
    // Function to generate a round robin tournament schedule
    function generateRoundRobin(teams) {
        const schedule = [];
        const numTeams = teams.length;
        
        // If odd number of teams, add a "BYE" team
        const teamsCopy = [...teams];
        if (numTeams % 2 !== 0) {
            teamsCopy.push("BYE");
        }
        
        const n = teamsCopy.length;
        
        // Generate rounds
        for (let round = 0; round < n - 1; round++) {
            const matches = [];
            
            for (let i = 0; i < n / 2; i++) {
                const team1 = teamsCopy[i];
                const team2 = teamsCopy[n - 1 - i];
                
                // Skip matches involving the "BYE" team
                if (team1 !== "BYE" && team2 !== "BYE") {
                    matches.push({ team1, team2 });
                }
            }
            
            schedule.push({ round: round + 1, matches });
            
            // Rotate teams for the next round (keep first team fixed)
            teamsCopy.splice(1, 0, teamsCopy.pop());
        }
        
        return schedule;
    }
    
    // Function to display the generated schedule
    function displaySchedule(schedule) {
        roundsContainer.innerHTML = '';
        
        schedule.forEach(round => {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'round';
            
            roundDiv.innerHTML = `<h3>Round ${round.round}</h3>`;
            
            round.matches.forEach(match => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'match';
                matchDiv.textContent = `${match.team1} vs ${match.team2}`;
                roundDiv.appendChild(matchDiv);
            });
            
            roundsContainer.appendChild(roundDiv);
        });
    }
    
    // Save the schedule (using localStorage)
    saveScheduleButton.addEventListener('click', function() {
        const tournamentName = document.getElementById('tournamentName').value.trim() || 'Tournament';
        const numTeams = parseInt(numTeamsInput.value);
        
        // Collect teams data
        const teams = [];
        for (let i = 1; i <= numTeams; i++) {
            const teamName = document.getElementById(`team${i}`).value.trim();
            teams.push(teamName || `Team ${i}`);
        }
        
        // Generate schedule data
        const schedule = generateRoundRobin(teams);
        
        // Create tournament data object
        const tournamentData = {
            name: tournamentName,
            teams: teams,
            schedule: schedule
        };
        
        // Save to localStorage
        try {
            localStorage.setItem('roundRobinTournament', JSON.stringify(tournamentData));
            alert('Tournament schedule saved successfully!');
        } catch (e) {
            alert('Failed to save tournament data.');
            console.error('Save error:', e);
        }
    });
    
    // Print the schedule
    printScheduleButton.addEventListener('click', function() {
        window.print();
    });
    
    // Check if there's saved data to load
    function loadSavedTournament() {
        const savedData = localStorage.getItem('roundRobinTournament');
        
        if (savedData) {
            try {
                const tournamentData = JSON.parse(savedData);
                
                // Populate tournament name
                document.getElementById('tournamentName').value = tournamentData.name;
                
                // Set number of teams
                const teams = tournamentData.teams;
                numTeamsInput.value = teams.length;
                
                // Create team inputs and populate them
                createTeamInputs(teams.length);
                teams.forEach((team, index) => {
                    document.getElementById(`team${index + 1}`).value = team;
                });
                
                // Generate and display schedule
                displaySchedule(tournamentData.schedule);
                
                // Show schedule section
                scheduleOutput.style.display = 'block';
                
                alert('Loaded saved tournament data!');
            } catch (e) {
                console.error('Load error:', e);
            }
        }
    }
    
    // Try to load saved data when the page loads
    // Uncomment the line below if you want to auto-load saved data
    // loadSavedTournament();
});