import logo from "./logo.svg";
import "./App.css";

function App() {
  const onCreate = async () => {
    try {
      const data = await fetch(`http://localhost:4000/workouts/5`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: "test2",
          description: "test2",
          category: "test1231",
        }),
      }).then((res) => res.json());

      console.log({ data });
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={onCreate}>test</button>
      </header>
    </div>
  );
}

export default App;
