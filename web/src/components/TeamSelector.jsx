export default function TeamSelector({standings, selectedTeam, setSelectedTeam}) {
    return <div>
        <button className={selectedTeam === 'all' ? 'teamButton selectedTeamButton' : 'teamButton'} onClick={()=>{setSelectedTeam()}}>All teams</button>
        {standings?.map(team => {
        return <button className={selectedTeam === team.teamId ? 'teamButton selectedTeamButton' : 'teamButton'} key={team.teamId} onClick={()=>{setSelectedTeam(team.teamId)}}>{team.teamShortName}</button>
    })}</div>
}