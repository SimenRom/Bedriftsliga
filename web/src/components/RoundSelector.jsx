export default function RoundSelector({rounds, selectedRound, setSelectedRound}) {
    return <div>
        <button className={selectedRound === 'all' ? 'roundButton selectedRoundButton' : 'roundButton'} onClick={()=>{setSelectedRound()}}>All rounds</button>
        {rounds.map(round => {
        return <button className={selectedRound === round ? 'roundButton selectedRoundButton' : 'roundButton'} key={round} onClick={()=>{setSelectedRound(round)}}>{round}</button>
    })}</div>
}