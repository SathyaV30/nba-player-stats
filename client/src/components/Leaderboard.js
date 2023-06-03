import React from 'react';

const Leaderboard = () => {
    const users = [
        { name: "User1", points: 123 },
        { name: "User2", points: 111 },
        { name: "User3", points: 107 },
        { name: "User4", points: 99 },
        // ... more users
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1>Leaderboard</h1>
            {users.slice(0, 3).map((user, index) => (
                <div key={index} style={{ 
                    backgroundColor: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 3 ? 'bronze' : 'white', 
                    width: '200px', 
                    height: '50px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '10px',
                    borderRadius: '10px',
                }}>
                    <span style={{ fontSize: '20px', marginRight: '10px' }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <span>{user.name} - {user.points} points</span>
                </div>
            ))}
            {users.slice(3).map((user, index) => (
                <div key={index+3} style={{ 
                    width: '200px', 
                    height: '50px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '10px',
                    borderRadius: '10px',
                    backgroundColor: 'white',
                    border: '1px solid black'
                }}>
                    <span>{index+4}. {user.name} - {user.points} points</span>
                </div>
            ))}
        </div>
    )
}

export default Leaderboard;
