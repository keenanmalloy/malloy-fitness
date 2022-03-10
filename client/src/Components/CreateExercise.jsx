import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateExercise = ({ exercises, setExercises }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [profile, setProfile] = useState("");
  const [type, setType] = useState("");
  const [primary, setPrimary] = useState([]);
  const [secondary, setSecondary] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    /**
     *  BODY OF `/exercises/`
     *  API POST REQUEST
     *
     *  name: string;
     *  description: string;
     *  category: string;
     *  primary: string[];
     *  secondary: string[];
     *  video: string;
     *  profile: string;
     */

    const exercise = {
      name,
      description,
      category,
      profile,
      type,
      primary,
      secondary,
    };

    console.log({ exercise });

    // setIsLoading(true);

    // fetch('http://localhost:4000/exercises', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(exercise),
    // }).then(() => {
    //   console.log('new exercise added');
    //   setIsLoading(false);
    // });
  };

  let navigate = useNavigate();
  const routeChange = () => {
    let path = "/exercises";
    navigate(path);
  };

  return (
    <>
      <button
        onClick={routeChange}
        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      >
        Admin
      </button>
      <form onSubmit={handleSubmit}>
        {/* 
          Extract input & label to the component called <Input />
          Pass it the following props 
          
          <Input 
            onChange={*function*} ex - (e) => setName(e.target.value)
            value={*text*} 
            label={*text*} 
            isRequired={*boolean*} 
            isTextArea={*boolean*} 
          />
        */}
        <label>Exercise name:</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* 
          Reuse the <Input /> component created in the above message
          Remember to set the isTextArea prop so we can conditionally render a textarea in the component
        */}
        <label>Exercise description:</label>
        <textarea
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* 
          Extract select, option & label to the component called <Select />
          Pass it the following props 
          
          <Select 
            onChange={*function*} 
            value={*text*} 
            label={*text*} 
            isRequired={*boolean*} 
            options={*Array of strings*} ex ['chest', 'back', 'legs']
            defaultOption={*text*} 
          />
        */}
        <label>Exercise category:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">--choose a category --</option>
          <option value="chest">chest</option>
          <option value="arms">arms</option>
          <option value="back">back</option>
          <option value="legs">legs</option>
          <option value="shoulders">shoulders</option>
        </select>

        {/* 
          Extract the group of radio buttons - input & label to the component called <RadioGroup />
          Pass it the following props 
          
          <RadioGroup 
            onChange={*function*}
            label={*text*}
            checked={*text*} ex. profile state - 'short' || 'long'
            isRequired={*boolean*} 
            options={*Array of strings*} ex ['short', 'mid', 'long']
          />
        */}
        <>
          <label>Resistance profile: </label>
          <label htmlFor="short">Short</label>
          <input type="radio" name="resistance-range" />

          <label htmlFor="long">Long</label>
          <input type="radio" name="resistance-range" />

          <label htmlFor="mid">Mid</label>
          <input type="radio" name="resistance-range" />
        </>

        <br />

        {/* 
          Create the following component:

           <SelectMuscleGroups 
            onPrimaryChange={*function*} ex a function that handles the state for the primary muscle groups selected
            onSecondaryChange={*function*} ex a function that handles the state for the primary muscle groups selected
            primary={*Array of Objects (muscle groups)*} -- state
            secondary={*Array of Objects (muscle groups)*} -- state
          /> 
        */}
        <label> Muscle groups: </label>
        <input type="text" placeholder="primary" />
        <input type="text" placeholder="secondary" />
        <br />

        {!isLoading && (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
            Add exercise
          </button>
        )}
        {isLoading && (
          <button
            disabled
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          >
            Adding exercise...
          </button>
        )}
      </form>
    </>
  );
};
