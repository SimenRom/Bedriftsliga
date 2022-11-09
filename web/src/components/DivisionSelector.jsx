import { useEffect } from 'react';

const Lobbies = require('../Lobbies.json');

export default function DivisionSelector({season, selectedLobby, selectNewLobby}) {
    var lobbies = Lobbies[season];
    useEffect(()=>{
        //console.log(selectedLobby);
        // console.log(lobbies);
    })
    return <div className='LobbySelectorWrapper'>{lobbies.map(lobby => {
        return <button className={selectedLobby?.name === lobby.name ? 'lobbyButton selectedLobbyButton' : 'lobbyButton'} key={lobby.name} onClick={()=>{selectNewLobby(lobby)}}>{lobby.displayName}</button>
    })}</div>
}