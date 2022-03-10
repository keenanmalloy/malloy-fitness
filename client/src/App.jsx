import { Header } from "./Components/Header";
import { GetAllExercises } from "./Components/GetAllExercises";
import { GetSingleExercise } from "./Components/GetSingleExercise";
import { CreateExercise } from "./Components/CreateExercise";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/exercises" element={<GetAllExercises />} />
        <Route path="/exercises/:id" element={<GetSingleExercise />} />
        <Route path="/exercises/create" element={<CreateExercise />} />
      </Routes>
    </div>
  );
}

export default App;
