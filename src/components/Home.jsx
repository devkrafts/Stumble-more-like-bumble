import React, { useLayoutEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRightCircle, Copy } from 'react-feather';
import homeImage1 from '../assets/images/home-image1.jpg';
import homeImage2 from '../assets/images/home-image2.jpg';
import homeImage3 from '../assets/images/home-image3.jpg';
import homeImage4 from '../assets/images/home-image4.jpg';
import './styles/home.css';

const Home = () => {
    const screenRef = useRef(null);

    useLayoutEffect(() => {
        if(screenRef.current && window.innerHeight) {
            screenRef.current.style.height = `${window.innerHeight}px`;
        }
      }, []);

    // handle navigation to Room page
    const navigation = useNavigate();
    const handleSessionNavigation = () => {
        navigation(`/session/${uniqueId}`)
    }


    // generate unique session id
    const [uniqueId, setUniqueId] = useState("");
    const generateUniqueId = () => {
        let key = "";
        const length = 6;
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let counter = 0; counter < length; counter++) {
            key += characters.charAt(Math.floor(Math.random() * charactersLength));

        }
        setUniqueId(key);

    }

    // when the other user joins via same unique id
    const [inputUniqueId, setInputUniqueId] = useState("");
    const getUniqueIdFromInput = (e) => {
        setInputUniqueId(e.target.value)

    }

    // navigation for 2nd user
    const navigationUser2 = useNavigate();
    const handleSessionNavigationUser2 = () => {
        navigationUser2(`/session/${inputUniqueId}`)
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(uniqueId);
            alert('Copied to clipboard');
        } catch(err) {
            console.log(err);
        }
    }

    return <div className="home" ref={screenRef}>
        <div className="home__header">Stumble</div>
            {
                !uniqueId &&
                <div className="home__create">
                    <button
                        className="home__create__action"
                        onClick={generateUniqueId}
                    >
                        Get Invite
                    </button>
                </div>
            }
        {
            uniqueId &&
            <>
                <div className="home__helper-text">Share this invite code with your friend.</div>
                <div className="home__uid">
                    <div className="home__uid__value">{uniqueId}</div>
                    <button className="home__uid__copy" onClick={handleCopy}><Copy /></button>
                </div>
            </>
        }

        <div className="home__carousal">
            <div className="home__carousal__images">
                <div className="home__carousal__images__item">
                    <img src={homeImage1} alt='img1'/>
                </div>
                <div className="home__carousal__images__item">
                    <img src={homeImage2} alt='img2'/>
                </div>
                <div className="home__carousal__images__item">
                    <img src={homeImage3} alt='img3'/>
                </div>
                <div className="home__carousal__images__item">
                    <img src={homeImage4} alt='img4'/>
                </div>
            </div>
        </div>

        {/*conditional rendering of elems when the user is the creator of session */}
        {
            !uniqueId &&
            <div className="home__join">
                <div className="home__join__prompt">Already invited?</div>
                <div className="home__join__input">
                    <input onChange={getUniqueIdFromInput} value={inputUniqueId} maxLength={6} placeholder="Enter invite code" />
                </div>
                <button className="home__join-room" onClick={handleSessionNavigationUser2} disabled={inputUniqueId.length !== 6}>Join room <ArrowRightCircle /></button>
            </div>
        }

        {
            uniqueId &&
            <div className="home__footer">
                <button className="home__join-room--primary" onClick={handleSessionNavigation}>Join room <ArrowRightCircle /></button>
            </div>
        }
    </div >
}

export default Home;