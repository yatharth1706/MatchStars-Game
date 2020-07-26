import * as React from 'react';

const PlayAgain = (props) => {
    return (
      <div className="game-done">
        <div className="message" style = {{color : props.gameStatus === 'lost' ? 'red' : 'green'}}>
          {props.gameStatus === 'lost' ? 'Game OVer' : 'Nice'}
        </div>
        
        <button onClick = {props.onClick}>Play Again</button>
      </div>
    )
  }

  export default PlayAgain;