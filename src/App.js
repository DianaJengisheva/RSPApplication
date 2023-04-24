import React, { useState, useEffect } from "react";
import "./App.css";
import mp3 from './Components/music.mp3';
import ReactPlayer from 'react-player';


const getRandomType = () => {

  const types = ["rock", "paper", "scissors"];

  const randomIndex = Math.floor(Math.random() * types.length);

  return types[randomIndex];

}

const getRandomPosition = () => {

  const x = Math.floor(Math.random() * window.innerWidth);

  const y = Math.floor(Math.random() * window.innerHeight);

  return { x, y };

}

const getRandomDirection = () => {

  const dx = Math.random() < 0.5 ? -1 : 1;

  const dy = Math.random() < 0.5 ? -1 : 1;

  return { dx, dy };
}


const getDistance = (point1, point2) => {

  const dx = Math.abs(point1.x - point2.x);
  const dy =  Math.abs(point1.y - point2.y);
  const distance = Math.sqrt((dx * dx) + (dy * dy));

  return distance;
  
};

const App = () => {

  const [components, setComponents] = useState([
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
    {type: getRandomType(), position: getRandomPosition(), direction: getRandomDirection()},
  ]);
    

  const [winner, setWinner] = useState(null);

  useEffect(() => {

    const interval = setInterval(() => {

      moveComponents();

    }, 12);

    return () => clearInterval(interval);

  }, []);

  useEffect(() => {

    const types = new Set(components.map((c) => c.type));

    if (types.size === 1) {

      setWinner(types.values().next().value);

    }

  }, [components]);

  const moveComponents = () => {

    setComponents((prevComponents) =>

      prevComponents.map((component, index) => {

        let { x, y } = component.position;

        const { dx, dy } = component.direction;

        x += dx;

        y += dy;

        if (x < 0 || x > window.innerWidth - 50) {

          component.direction.dx *= -1;

        }

        if (y < 0 || y > window.innerHeight - 50) {

          component.direction.dy *= -1;

        }

        for (let i = index + 1; i < prevComponents.length; i++) {

          const otherComponent = prevComponents[i];

          const distance = getDistance(component.position, otherComponent.position);

          if (distance < 62 ) {

            handleCollision(index, i);

          }

        }


        return {
          ...component,
          position: { x, y },
        };
      })
    );
  };

  const handleCollision = (index1, index2) => {


    const c1 = components[index1];
  
    const c2 = components[index2];
  
    if (c1.type === c2.type) {
      return;
    }
  
    let winnerType;
  
    let loserIndex;
  
    let winnerIndex;

      
    if (
      (c1.type === "rock" && c2.type === "scissors") ||
      (c1.type === "paper" && c2.type === "rock") ||
      (c1.type === "scissors" && c2.type === "paper")
    ) {

      winnerType = c1.type;
      loserIndex = index2;
      winnerIndex = index1;

    } else {

      winnerType = c2.type;
      loserIndex = index1;
      winnerIndex = index2;

    }
  
    setComponents((prevComponents) => {

  
      const newComponents = [...prevComponents];
  
      const loserComponent = newComponents[loserIndex];
      
      const winnerComponent = newComponents[winnerIndex];

      const distance = getDistance(loserComponent.position, winnerComponent.position);
  
      const dx = (winnerComponent.position.x - loserComponent.position.x) / distance;
      const dy = (winnerComponent.position.y - loserComponent.position.y) / distance;
  
      loserComponent.direction = { dx: -dx, dy: -dy };
      winnerComponent.direction = { dx, dy };

      loserComponent.type = winnerType;

      newComponents[loserIndex] = loserComponent;
      newComponents[winnerIndex] = winnerComponent
  
      return newComponents;
    });

    

  };

  const renderComponent = (component, index) => {

    return (
      <div
        key={index}
        className={`component ${component.type}`}
        style={{
          left: component.position.x,
          top: component.position.y,
        }}
      ></div>
    );
  };


  return (
    <div className="App">
      <div className="game-board">
        {components.map((component, index) =>
          renderComponent(component, index)
        )}
      </div>
      
      <ReactPlayer 
        playing 
        loop
        width='100%'
        url={mp3}
        type = 'audio/mp3'
      />
      {winner && (
        <div className="winner">
          <p>{`The winner is: ${winner}`}</p>
        </div>
      )}

</div>); 
}




export default App;