import fetch from "node-fetch";

const div3A = '1220095f-ba0d-422a-9e65-d40e5786c3c2';
const standingsURL = `https://app.masterblaster.gg/api/scores/standings/${div3A}`;
const tournamentInfoURL = `https://app.masterblaster.gg/api/Tournament/cached/${div3A}`;
//const matchesURL = `https://app.masterblaster.gg/api/matches/tournament/${div3A}?includeStreamedMatchesOnly=false`;
async function getStandings(){
    return await fetch(standingsURL).catch(err => console.log(err)).then(data => data.json());
}
async function getTeamsInfo(){
    return await fetch(tournamentInfoURL).catch(err => console.log(err)).then(data => data.json());
}

export async function createStandingTable(){
    var teamsInfo = (await getTeamsInfo()).tournamentTeams.map(data => data.team).map(team => {
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

    const standings = (await getStandings()).map(team => {
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