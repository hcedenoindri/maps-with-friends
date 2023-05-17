import React, { FC, useState, useEffect } from "react";

let globalInterval = 0;

interface ItimerProps {
    setTimerDone: (arg: () => boolean) => void;
    setTimerKey:  (arg: () => NodeJS.Timer) => void;
}
const Timer: FC<ItimerProps> = ({ setTimerDone, setTimerKey }) => {
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const timeAtRender = Date.now();
    let time = 0;
    let firstTime = true;

    const getTime = (interval: NodeJS.Timer) => {
        const deadline = timeAtRender + 122000;
        time = deadline - Date.now();

        if (firstTime) {
            setTimerKey(() => {
                return interval;
            });
            firstTime = false;
        }

        if (time <= 0) {
            setTimerDone(() => {
                return true;
            });
            return;
        }

        setMinutes(Math.floor((time / 1000 / 60) % 60));
        setSeconds(Math.floor((time / 1000) % 60));
    };

    useEffect(() => {
        setTimeout(() => {console.log("Waiting for Street View...")}, 3000);
        const interval: NodeJS.Timer = setInterval(() => getTime(interval), 995);
        return () => clearInterval(interval);
    }, []);

    if (minutes == 0 && seconds == 0) {
        return (
            <div className="timer timer-end">
                {minutes}:0{seconds}
            </div>
        );
    }
    if (minutes == 0 && seconds <= 30) {
        if (seconds < 10) {
            return (
                <div className="timer timer-ending">
                {minutes}:0{seconds}
                </div>
            );
        }
        return (
            <div className="timer timer-ending">
                {minutes}:{seconds}
            </div>
        );
    }
    if (seconds < 10) {
        return (
            <div className="timer">
                {minutes}:0{seconds}
            </div>
        );
    }
    return (
        <div className="timer">
            {minutes}:{seconds}
        </div>
    );
};

// export const stopTimer: () => void = () => {
//     clearInterval();
// };

export default Timer;