import { Header } from './Components/Header';
import { GetAllExercises } from './Components/GetAllExercises';
import { GetSingleExercise } from './Components/GetSingleExercise';
import { CreateExercise } from './Components/CreateExercise';
import { UpdateExercise } from './Components/UpdateExercise';
import { Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/exercises" element={<GetAllExercises />} />
        <Route path="/exercises/:id" element={<GetSingleExercise />} />
        <Route path="/exercises/create" element={<CreateExercise />} />
        {/* <UpdateExercise/> */}
      </Routes>
    </div>
  );
}

export default App;
