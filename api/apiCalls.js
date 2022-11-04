import fetch from "node-fetch";
const div3AId = '1220095f-ba0d-422a-9e65-d40e5786c3c2';

async function getStandings(id){
    const standingsURL = `https://app.masterblaster.gg/api/scores/standings/${id || div3AId}`;
    return await fetch(standingsURL).catch(err => console.log(err)).then(data => data.json());
}
async function getTeamsInfo(id){
    const tournamentInfoURL = `https://app.masterblaster.gg/api/Tournament/cached/${id || div3AId}`;
    return await fetch(tournamentInfoURL).catch(err => console.log(err)).then(data => data.json());
}
async function getLobbyMatches(id){
    const matchesURL = `https://app.masterblaster.gg/api/matches/tournament/${id || div3A}?includeStreamedMatchesOnly=false`;
    return await fetch(matchesURL).catch(err => console.log(err)).then(data => data.json());
}
export async function createLobbyMatches(id, teamsInfo){
    var matches = await getLobbyMatches(id);
    matches = matches.matches.map(match => {
        var { matchSeries, teamScores } = match;
        const matchTeamScores = teamScores;
        var {name, completedAt, settings, startingAt, startedAt, teams, teamScores, series, playerIds, teamIds, id, hasForfeited, roundIndex } = matchSeries;
        
        var teamsFormatted = {
            team1: {...teams[0], name: teamsInfo.find(team => team.id === teams[0].teamId)?.name }, 
            team2: {...teams[1], name: teamsInfo.find(team => team.id === teams[1].teamId)?.name }
        };
        var matchScore = {
            match1: {
                map: series[0]?.displayName || 'No map info',
                scoreTeam1: matchTeamScores.find(score => score.matchId === series[0].id && score.teamId === teamsFormatted.team1.teamId)?.value || '?',
                scoreTeam2: matchTeamScores.find(score => score.matchId === series[0].id && score.teamId === teamsFormatted.team2.teamId)?.value || '?',
            },
            match2: {
                map: series[0]?.displayName || 'No map info',
                scoreTeam1: matchTeamScores.find(score => score.matchId === series[1].id && score.teamId === teamsFormatted.team1.teamId)?.value || '?',
                scoreTeam2: matchTeamScores.find(score => score.matchId === series[1].id && score.teamId === teamsFormatted.team2.teamId)?.value || '?',
            }
        }
        settings = {numberOfMaps: settings.numberOfMaps, twitchStreamingUrl: settings.twitchStreamingUrl, maxNumberOfTeams: settings.maxNumberOfTeams};
        var newMatchSeries = {name, completedAt, settings, matchScore, startingAt, startedAt, teamsFormatted, series, matchTeamScores, teamScores, playerIds, teamIds, id, hasForfeited, roundIndex };
        return newMatchSeries;
    })
    return matches;
}
export async function createTeamsInfo(id){
    var teamsInfo = (await getTeamsInfo(id)).tournamentTeams.map(data => data.team).map(team => {
        var {id, name, shortHandle, players} = team;
        players = players.map(player => {
            var playerInfo = player.player;
            var {id, name, nickName} = playerInfo;
            const newPlayer = {id, name, nickName};
            return newPlayer;
        })
        var newTeam = {id, name, shortHandle, players};
        return newTeam;
    });
    return teamsInfo;
}
export async function createStandingTable(id, teamsInfo){
    

    const standings = (await getStandings(id)).map(team => {
        var {teamId, points, wins, losses, draws, played, matches } = team;
        matches = matches.map(match => {
            var {matchSeriesId, points, result } = match;
            const newMatch = {matchSeriesId, points, result };
            return newMatch;
        });
        var teamInfo = teamsInfo.find(team => team.id === teamId)
        var teamName = teamInfo.name || 'Ukjent navn';
        var teamShortName = teamInfo.shortHandle || 'Ukjent shortName';
        const newTeam = {teamId, teamName, teamShortName, points, wins, losses, draws, played, matches};
        return newTeam;
    });
    return standings;
}