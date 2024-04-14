import React, { useEffect, useState } from 'react'
import Board from './Board'
import Gameover from './Gameover';
import GameState from './Gamestate';
import Reset from './Reset';
import gameOverSoundAsset from '../sounds/gameover.wav';
import clickSoundAsset from '../sounds/tap.wav';

const gameOverSound = new Audio(gameOverSoundAsset);
gameOverSound.volume = 0.2;
const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

const player_x = "X";
const player_o = "O";

const winningCombinations = [
    //Rows
    {combo:[0,1,2], strikeClass: "strike-row-1"},
    {combo:[3,4,5], strikeClass: "strike-row-2"},
    {combo:[6,7,8], strikeClass: "strike-row-3"},

    //Columns
    {combo:[0,3,6], strikeClass: "strike-column-1"},
    {combo:[1,4,7], strikeClass: "strike-column-2"},
    {combo:[2,5,8], strikeClass: "strike-column-3"},

    //Diagonal
    {combo:[0,4,8], strikeClass: "strike-diagonal-1"},
    {combo:[2,4,6], strikeClass: "strike-diagonal-2"},
    
];

function checkWinner(tiles, setStrikeClass, setGameState){
    // console.log('check winner');
    for(const {combo, strikeClass} of winningCombinations){
        const tileValue1 = tiles[combo[0]]; 
        const tileValue2 = tiles[combo[1]]; 
        const tileValue3 = tiles[combo[2]];
        
        if(tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3){
            setStrikeClass(strikeClass);
            if (tileValue1 === player_x){
                setGameState(GameState.playerXWins);
            }
            else{
                setGameState(GameState.playerOWins);
            }
            return;
        }
    }

    
    const areAllTilesFilledIn = tiles.every((tile) => tile !== null);
    if(areAllTilesFilledIn){
        setGameState(GameState.draw);
    }
}

const Tictactoe = () => {

    const [tiles, setTiles] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(player_x);
    const [strikeClass, setStrikeClass] = useState();
    const [gameState, setGameState] = useState(GameState.inProgress);


    const handleReset = () => {
        // console.log("reset");
        setGameState(GameState.inProgress);
        setTiles(Array(9).fill(null));
        setPlayerTurn(player_x);
        setStrikeClass(null);
    };
    
    useEffect(() =>{
        checkWinner(tiles, setStrikeClass, setGameState);
    }, [tiles]);

    useEffect(()=>{
        if(tiles.some((tile) => tile !== null)){
            clickSound.play();
        }
    }, [tiles]);

    useEffect(()=>{
        if(gameState !== GameState.inProgress){
            gameOverSound.play();
        }
    }, [gameState]);
    

    const handleTileClick = (index) => {
        //disable game after winning situation
        if(gameState !== GameState.inProgress){
            return;
        }

        if(tiles[index] !==null ){
            return;
        }

        //console.log(index);
        const newTiles = [...tiles];
        newTiles[index] = playerTurn;
        setTiles(newTiles);
        if(playerTurn === player_x){
            setPlayerTurn(player_o);
        }
        else{
            setPlayerTurn(player_x);
        }
    };

  return (
    <div>
        <div className="heading">
            Tic Tac Toe              
        </div>
        <div className="info">
            Turn up your volume!
        </div>
            <Board playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} strikeClass={strikeClass}/>
            <Gameover gameState={gameState}/>
            <Reset gameState={gameState} onReset={handleReset}/> 
                   
    </div>
  )
}

export default Tictactoe