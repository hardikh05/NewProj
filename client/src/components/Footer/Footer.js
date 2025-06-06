import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import FabButton from '../Fab/Fab'

const Footer = () => {
    const location = useLocation()
    const [user, setUser ] = useState(JSON.parse(localStorage.getItem('profile')))

    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    return (
        <footer>
            
            {user && (
            <FabButton />
            )}
        </footer>
    )
}

export default Footer
