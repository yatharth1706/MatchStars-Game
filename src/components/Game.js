import * as React from 'react';
import {useEffect, useState} from 'react';
import StarsDisplay from './StarDisplay';
import PlayAgain from './PlayAgain';
import utils from './../math-utils';
import PlayNumber from '../components/PlayNumber';

// Custom Hook
const useGameState = () => {
    const [stars,setStars] = useState(utils.random(1,9));
    
    // candidateNums
    // wrongNums
    // usedNumsa
    // availableNums
    const [availableNums, setAvailableNums] = useState(utils.range(1,9));
    const [candidateNums, setCandidateNums] = useState([]);
    const [secondsLeft, setSecondsLeft] = useState(10);
    
    // setTimeout 
    useEffect(() => {
      // console.log('Rendered...');
      if(secondsLeft > 0 && availableNums.length > 0){
          const timerId = setTimeout(() => {
          setSecondsLeft(secondsLeft - 1);
        },1000);
        return () => clearTimeout(timerId);
      }
      
    });
    
    const setGameState = (newCandidateNums) => {
        if(utils.sum(newCandidateNums) !== stars) {
        setCandidateNums(newCandidateNums);
      } else {
        const newAvailableNums = availableNums.filter(n => {return !newCandidateNums.includes(n)})
        console.log(newAvailableNums);
        setStars(utils.randomSumIn(newAvailableNums, 9))
        setAvailableNums(newAvailableNums);
        setCandidateNums([]);
      }
    }
    
    return {
      stars, availableNums, candidateNums, secondsLeft, setGameState
    };
  }
  
  const Game = (props) => {
    
    const {
      stars,
      availableNums,
      candidateNums,
      secondsLeft,
      setGameState
    } = useGameState();
    
    
    const candidatesAreWrong = utils.sum(candidateNums) > stars;
          
    const gameStatus = availableNums.length === 0 ? 'won' : secondsLeft === 0 ? 'lost' : 'active';
    const numberStatus = (number) => {
      if(!availableNums.includes(number)){
        return 'used';
      }
      
      if(candidateNums.includes(number)){
        return candidatesAreWrong ? 'wrong' : 'candidate';
      }
        
      return 'available';
    }
    
    
    const onNumberClick = (number, currentStatus) => {
        // currentStatus => newStatus
      if(gameStatus!== 'active' || currentStatus == 'used'){
        return;
      }
      
      // if number is not used check for candidacy
      
      const newCandidateNums = currentStatus === 'available' ? candidateNums.concat(number) : candidateNums.filter(cn => cn!== number);
      
      setGameState(newCandidateNums);
      // redraw stars which are playable
      
      
    }
    
    return (
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of stars
        </div>
        <div className="body">
          <div className="left">
            { gameStatus !== 'active' ? (
              <PlayAgain onClick = {props.startNewGame} gameStatus={gameStatus}/>
            ) : (
              <StarsDisplay count = {stars}/>
            )}
          </div>
          <div className="right">
            {utils.range(1,9).map(numberId => <PlayNumber key = {numberId} status = {numberStatus(numberId)} number = {numberId} onClick={onNumberClick}/>)}
          </div>
        </div>
        <div className="timer">Time Remaining: {secondsLeft}</div>
      </div>
    );
  };

  export default Game;