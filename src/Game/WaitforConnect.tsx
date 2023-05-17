import { useEffect, useState } from 'react';
import { useNavigate, useNavigation,useLocation } from "react-router-dom";
import { supabase } from "../Store/Supabase";
import { authUserLogin } from "../Store/UserAuth";
type WaitingScreenProps = {
  waitingText: string;
};

const WaitingScreen = ({ waitingText }: WaitingScreenProps) => {
  const location = useLocation()
  const navigation = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const user = queryParams.get('user') ? JSON.parse(queryParams.get('user')!) : null;
  const gameID = queryParams.get('gameID') ? JSON.parse(queryParams.get('gameID')!) : null;
  console.log(user);
  const [dots, setDots] = useState('.');
  const [linkText, setLinkText] = useState('');


  //WAIT FOR CONNECT TODO ------------

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
        if(data[0]['P2Connect']!=false){
            console.log("Success!");
            const gameIDencode = encodeURIComponent(JSON.stringify(gameID));
            const encodedObject = encodeURIComponent(JSON.stringify(user));
            navigation(`../play?user=${encodedObject}&gameID=${gameIDencode}`);
        }
    }
  };

  useEffect(() => {
    // async function to fetch the linkText
    const fetchLinkText = async () => {
      setLinkText(`http://mwf.world/link?gameID=${gameID}`);// TODO --------------- CHANGE THIS TO SERVER ADDY BEFORE RELEASE PLS
    };

    // call the function once when the component mounts
    fetchLinkText();

    // set up interval to add dots every second
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots === '...') {
          return '.';
        } else {
          return prevDots + '.';
        }
      });
    }, 1000);

    // clean up interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(dummyFunction, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'blue',
        color: 'white',
        fontSize: '3rem',
      }}
    >
      <div>
        {waitingText}
        {dots}
      </div>
      <div>Multiplayer Link:</div>
      <div> {linkText || 'Loading Link'+ dots}</div>
    </div>
  );
};

const waitingText = 'Waiting for opponent to connect';
const App = () => {
  return (
    <div>
      <WaitingScreen waitingText={waitingText} />
    </div>
  );
};

export default App;
