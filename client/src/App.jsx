import { Header } from './Components/Header';
import { GetAllExercises } from './Components/GetAllExercises';
import { GetSingleExercise } from './Components/GetSingleExercise';
import { CreateExercise } from './Components/CreateExercise';
import { UpdateExercise } from './Components/UpdateExercise';

function App() {
  return (
    <div className="App">
      <Header />
      <GetAllExercises />
      {/* <CreateExercise /> */}
      {/* <GetSingleExercise/> */}
      {/* <UpdateExercise/> */}
    </div>
  );
}

export default App;
