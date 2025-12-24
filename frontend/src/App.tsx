import {Routes , Route} from 'react-router-dom'


function App() {
    return (
      <div className="h-screen w-full flex justify-center items-center">
            <Routes>
	    {/* Of course you can add the routes up in here as of now this is just the bare one */}
                <Route path="/" element={<h1>Hello this is the landing page</h1>} />
                <Route path="/:loginOrSignup" element={<h1>Hello this is the loginOrSignupPage</h1>} />
                <Route path="/home/*" element={<h1>Hello this is the home followed by something page</h1>} />
                <Route path="*" element={<h1>Hello this is the default 404 page</h1>} />
            </Routes>
        </div>
    )
}

export default App
