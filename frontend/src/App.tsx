import { useState } from 'react'
import './App.css'


function App() {
    const [showPeople, setShowPeople] = useState(true)
    const peoples : string[] = ["Aalok" , "Abhiyan" , "Bigya" ,"Sameer" , "Sijan"  ]
    return (
	<div className = "h-screen w-screen">
	{(showPeople) ? 
	    <div className = "h-full w-full">
	    <button
	    onClick = {()=>setShowPeople(false)}
	    >
		View Contributers
	    </button>
	    <div>
	    Project Libsense
	    </div>
	</div>
	: 
	<div className = "h-full w-full flex flex-nowrap flex-row justify-center items-center">
	    <button
	    onClick = {()=>setShowPeople(true)}
	    >
		Hide Contributers
	    </button>
	    <ul>
	    <>{
		peoples.map(people => <li key={people}>{people}</li>)
	    }
	    </>
	    </ul>
	</div>
	}	
	</div>
    )
}

export default App
