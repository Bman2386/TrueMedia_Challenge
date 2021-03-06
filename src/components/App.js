import React, {useState, useEffect} from 'react'
import {getQBs, getStats} from '../util/getData.js'

import '../css/App.css'

function App() {
  const [data, setData] = useState(null)
  const [token, setToken] = useState(null)
  const [stats0, setStats0] = useState(null)
  const [stats1, setStats1] = useState(null)
  const [stats2, setStats2] = useState(null)
  const [qb1, setQb1] = useState(null)
  const [qb2, setQb2] = useState(null)
  const [winner, setWinner] = useState(null)
  const [error, setError] = useState(null)

  // useEffect( () => { // Grab QB's on load
  //     getQBs().then(res => {
  //     setData(res)
  //   })
  // }, [])
  const grabStartingData = () => {
    getQBs(token).then(res => {
      if (res) {
        setError(null)
        setData(res)
      } else {
        setError('Invalid Token')
      }
      
    })
  }
  const viewStats = (qbId, idx) => {
    getStats(qbId, token).then(res => {
      switch (idx) {
        case 0:
           setStats0(res)
          break;
        case 1:
          setStats1(res)
          break;
        case 2:
          setStats2(res)
          break;
        default:
          break;
      }
    })
  }

  const statDisplay = (stats) => {
    const total = {
      "Att": 0,
      "Cmp": 0,
      "Sack": 0,
      "Int": 0,
      "PsYds": 0,
      "PsTD": 0,
      "Rush": 0,
      "RshYds": 0,
      "RshTD": 0,
      "games": 0
    }
    stats.forEach(game => {
      total.Att += game.Att
      total.Cmp += game.Cmp
      total.Sack += game.Sack
      total.Int += game.Int
      total.PsYds += game.PsYds
      total.PsTD = game.PsTD
      total.RshTD += game.RshTD
      total.games += 1
    })
    let qbRating = rating(total)
    total['rating'] = qbRating
    return (
      <ul>
        <li className='rating'>Rating: {total.rating}</li>
        <li>Attemps: {total.Att}</li>
        <li>Completions: {total.Cmp}</li>
        <li>Interceptions: {total.Int}</li>
        <li>PassYds: {total.PsYds}</li>
        <li>PassTDs: {total.PsTD}</li>
        <li>Rush: {total.Rush}</li>
        <li>Rushing Yds: {total.RshYds}</li>
        <li>RushingTD: {total.RshTD}</li>
      </ul>
    )

  }

  const rating = (total) => {
    let completionAvg = (total.Cmp/total.Att)*100
    completionAvg -= 30
    completionAvg *= .05
    let yardsPerAttempt = total.PsYds/total.Cmp
    yardsPerAttempt -= 3
    yardsPerAttempt *= .25
    let touchDownPercent = (total.PsTD/total.game) * .2
    if (!touchDownPercent) touchDownPercent = 0
    let interceptionPercent = (total.Int/total.Att) * 100
    if (!interceptionPercent) interceptionPercent = 0
    interceptionPercent *= .25
    interceptionPercent = 2.375 - interceptionPercent
    let qbRating = (completionAvg + yardsPerAttempt + touchDownPercent + interceptionPercent)/6
    qbRating *= 100
    return Math.round(qbRating*10)/10
    
  }
  const displayRaw = () => {
    return data.map((qb, idx) => {
      let currentStats 
      if (idx === 0) currentStats = stats0
      if (idx === 1) currentStats = stats1
      if (idx === 2) currentStats = stats2
      return (
        <div key={idx}className='qb'>
        <p className='name'>{`${qb.fullName}`} <img  className='qbImage' src={qb.playerImage} alt={qb.fullName}></img></p>
        <img src={qb.teamImage} alt='team' className='team'></img>
        {currentStats ? <div>{statDisplay(currentStats)}</div> : <button className='statsButton' onClick={()=> viewStats(qb.playerId, idx)}>View Stats</button>}
      </div>
      )})
  }

  const findQBStats = (id) => {
    const currId = parseInt(id)
    let found = false
    let i = 0
    while(!found){
      if (currId === data[i].playerId){
        found = true
      } else {
        i++
      }
    }
    if (i === 0) found = stats0
    if (i === 1) found = stats1
    if (i === 2) found = stats2
    return found
  }
  const finalScore=(qb) => {
    let avgTD = qb.totalTD/qb.totalGames
    if (!avgTD) avgTD = 0
    let avgInt = qb.totalInt/qb.totalGames
    if (!avgInt) avgInt = 0
    let avgYds = qb.totalYds/qb.totalGames
     avgYds /= 100
    return avgTD + avgYds - (avgInt*2)
  }
  const determineWinner =  () => {

    const qb1RawStats = findQBStats(qb1)
    const qb2RawStats = findQBStats(qb2)
    const qb1Score = {
      totalTD: 0,
      totalInt: 0,
      totalYds: 0,
      totalGames: 0
    }
    const qb2Score = {
      totalTD: 0,
      totalInt: 0,
      totalYds: 0,
      totalGames: 0
    }
    qb1RawStats.forEach(game => {
      if (!qb1Score.fullName) qb1Score['fullName'] = game.fullName
      qb1Score.totalTD += game.PsTD + game.RshTD
      qb1Score.totalInt += game.Int
      qb1Score.totalYds += game.PsYds + game.RshYds
      qb1Score.totalGames += 1
    })
    qb2RawStats.forEach(game => {
      if (!qb2Score.fullName) qb2Score['fullName'] = game.fullName
      qb2Score.totalTD += game.PsTD + game.RshTD
      qb2Score.totalInt += game.Int
      qb2Score.totalYds += game.PsYds + game.RshYds
      qb2Score.totalGames += 1
    })
    const qb1FinalScore = finalScore(qb1Score)
    const qb2FinalScore = finalScore(qb2Score)

    if (qb1FinalScore > qb2FinalScore) setWinner(qb1Score.fullName)
    if (qb2FinalScore > qb1FinalScore) setWinner(qb2Score.fullName)
    if (qb1FinalScore === qb2FinalScore) setWinner('Tie')
  }
  return (
    <div className="App">
      <h1 className='header'>NFL Quarterbacks</h1>
      {data? 
      <div className='body'>
      { stats0&&stats1&&stats2 ?
         <div className='compare'>
      
      <select onChange={(e) => setQb1(e.target.value)} value={qb1}>
        <option value="">Select a QB</option>
        <option value={data[0].playerId}>{data[0].fullName}</option>
        <option value={data[1].playerId}>{data[1].fullName}</option>
        <option value={data[2].playerId}>{data[2].fullName}</option>
      </select>
      <label> Vs. </label>
      <select onChange={(e) => setQb2(e.target.value)} value={qb2}>
        <option value="">Select a QB</option>
        <option value={data[0].playerId}>{data[0].fullName}</option>
        <option value={data[1].playerId}>{data[1].fullName}</option>
        <option value={data[2].playerId}>{data[2].fullName}</option>
      </select>
      {qb1 && qb2 ? <button onClick={() => determineWinner()}>Head to Head</button>: ''}
      {winner&&qb1&&qb2 ? <p className='winner'>Winner: {`${winner}`}</p>:''}
        </div>
       : ''}
          <div className='qbContainer'>
            {displayRaw()}
          </div>
      </div> : 
      <div className='starting-container'> 
        <label className='token-label'>Please Enter Token to use this site</label>
        <input
        value={token}
        onChange={(e)=>setToken(e.target.value)}
        ></input>
        <button onClick={()=> grabStartingData()}>Enter</button>
       
      </div>} 
       {error? <p className='error'>{`${error}`}</p> : ''}
    </div>
  );
}

export default App
