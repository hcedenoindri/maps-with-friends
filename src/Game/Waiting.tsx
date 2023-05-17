import React, { useState, useEffect, } from 'react';
import { useNavigate, useNavigation,useLocation } from "react-router-dom";
import { supabase } from "../Store/Supabase";
import { authUserLogin } from "../Store/UserAuth";

const WaitingScreen = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get('user') ? JSON.parse(queryParams.get('user')!) : null;
  const gameID = queryParams.get('gameID') ? JSON.parse(queryParams.get('gameID')!) : null;
  const navigation = useNavigate();
  
  //WAITING TODO -----------------

  //ALL NEW SUPABASE STUFF, CANT PORT FROM MYSQL

  //Check if user is user 1. If so, check if rounds is less than 1 [done]
  //if rounds is 0, we can set win condition on next currentTurn match. [done]
  //set popup on win, redirect back to main. [not done] ------------

     
  //if user is user 2 and rounds less than 1, check for win condition in a loop [done]
  //set popup on win, redirect back to main. [not done] ----------

  //if rounds more than 0, wait until your user ID matches what is held in currentTurn. [done]
  //redirect to Game.tsx [done]

  //Implement win screen [not done] -------------

  async function showWinnerPrompt(isPlayer1Winner: boolean) {
    const winnerText = isPlayer1Winner ? 'Player 1 has won!' : 'Player 2 has won!';
    const confirmationText = 'Ok';
  
    const result = await new Promise((resolve) => {
      const promptContainer = document.createElement('div');
      promptContainer.style.position = 'fixed';
      promptContainer.style.top = '0';
      promptContainer.style.left = '0';
      promptContainer.style.width = '100%';
      promptContainer.style.height = '100%';
      promptContainer.style.background = 'rgba(0, 0, 0, 0.6)';
      promptContainer.style.display = 'flex';
      promptContainer.style.justifyContent = 'center';
      promptContainer.style.alignItems = 'center';
      promptContainer.style.zIndex = '9999';
  
      const promptBox = document.createElement('div');
      promptBox.style.background = '#fff';
      promptBox.style.padding = '20px';
      promptBox.style.borderRadius = '5px';
      promptBox.style.textAlign = 'center';
  
      const promptText = document.createElement('p');
      promptText.style.fontSize = '20px';
      promptText.textContent = winnerText;
  
      const confirmButton = document.createElement('button');
      confirmButton.textContent = confirmationText;
      confirmButton.addEventListener('click', () => {
        promptContainer.remove();
        resolve(true);
      });
  
      promptBox.appendChild(promptText);
      promptBox.appendChild(confirmButton);
      promptContainer.appendChild(promptBox);
  
      document.body.appendChild(promptContainer);
    });
  
    // call async dummy function
    navigation(`../`);
  
    return result;
  }


  const [loadingText, setLoadingText] = useState('Waiting for opponent move');
  const [loadingPeriods, setLoadingPeriods] = useState('');

  const dummyFunction = async () => {
    const { data, error } = await supabase
    .from('multMode1')
    .select()
    .eq('id',gameID)
    
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
    if (data != null) {
      const numTurnsconst = data[0]['numTurns'];
      const user1pts = data[0]['score1'];
      const user2pts = data[0]['score2'];
      if(user.user.id == data[0]['user1']){
        if(data[0]['numTurns']==0){
          if(user.user.id == data[0]['currentTurn']){
            //set win condition, show win screen. calculate points and say who won -----------
            const { data, error } = await supabase
            .from('multMode1')
            .update({gameWon:true})
            .eq('id',gameID)
            if(user1pts>user2pts){
              showWinnerPrompt(true);
            }
            else{
              showWinnerPrompt(false);
            }
            //SHOW WIN SCREEN -------- [todo]
            // console.log("Win screen from p1");
            // navigation(`../`);
          }
        }
        else{
          if(user.user.id == data[0]['currentTurn']&&data[0]['gameWon']==false){
            //its our turn, send him to game
            const gameIDencode = encodeURIComponent(JSON.stringify(gameID));
            const encodedObject = encodeURIComponent(JSON.stringify(user))
            navigation(`../play?user=${encodedObject}&gameID=${gameIDencode}`);
          }
        }

      }
      else{
        if(data[0]['numTurns']==0){
          if(data[0]['gameWon']==true){
            //we're player 2. show win screen. calculate points and say who won -----------------
            //SHOW WIN SCREEN -------- [todo]
            //get num points
            if(user1pts>user2pts){
              showWinnerPrompt(true);
            }
            else{
              showWinnerPrompt(false);
            }
          }
        }
        else{
          if(user.user.id == data[0]['currentTurn']&&data[0]['gameWon']==false){
            //its our turn (p2), send him to game, decrement numTurns.
            const { data, error } = await supabase
            .from('multMode1')
            .update({numTurns: numTurnsconst-1})
            .eq('id',gameID)

            const gameIDencode = encodeURIComponent(JSON.stringify(gameID));
            const encodedObject = encodeURIComponent(JSON.stringify(user))
            navigation(`../play?user=${encodedObject}&gameID=${gameIDencode}`);
          }
        }
      }
    }
  };

  // useEffect(() => {
  //   const interval1 = setInterval(() => {
  //     setLoadingPeriods(loadingPeriods => {
  //       if (loadingPeriods === '...') {
  //         return '';
  //       } else {
  //         return loadingPeriods + '.';
  //       }
  //     });
  //   }, 1000);
  //   useEffect(() => {
  //       const interval = setInterval(dummyFunction, 10000);
  //       return () => clearInterval(interval);
  //     }, []);
  //   return () => {
  //     clearInterval(interval1);
  //   };
  // }, []);
    useEffect(() => {
      const interval1 = setInterval(() => {
        setLoadingPeriods(loadingPeriods => {
          if (loadingPeriods === '...') {
            return '';
          } else {
            return loadingPeriods + '.';
          }
        });
      }, 1000);

      const interval2 = setInterval(dummyFunction, 1000);

      return () => {
        clearInterval(interval1);
        clearInterval(interval2);
      };
    }, []);

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'blue',
        color: 'white',
        fontSize: '24px'
      }}
    >
      <div style={{ marginBottom: '24px' }}>{loadingText}{loadingPeriods}</div>
      <div className="loader"></div>
    </div>
  );
};

export default WaitingScreen;


export {};