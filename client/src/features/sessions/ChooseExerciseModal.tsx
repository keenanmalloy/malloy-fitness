import { CreateExercise } from 'features/exercises/components/CreateExercise';
import { FilterExercises } from 'features/exercises/components/FilterExercises';
import { Input } from 'features/form/Input';
import FullPageModal from 'features/modal/FullPageModal';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { SelectableExerciseList } from './SelectableExercistList';
import { useAddTaskToSessionMutation } from './useAddTaskToSession';
import { SessionSchema } from './useSessionSummaryQuery';

interface ChooseExerciseModalProps {
  data: SessionSchema;
  shouldRedirect?: boolean;
  isMultiSelectable?: boolean;
}

export const ChooseExerciseModal = ({
  data,
  shouldRedirect,
  isMultiSelectable,
}: ChooseExerciseModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [view, setView] = useState('');
  const [profile, setProfile] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const router = useRouter();

  const { mutate, isLoading, isError } = useAddTaskToSessionMutation(
    data.session.session_id
  );

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleExerciseSelection = (exerciseId: string) => {
    if (!isMultiSelectable) {
      const sessionId = data.session.session_id;
      mutate(
        { workoutId: data.session.workout_id, exerciseIds: [exerciseId] },
        {
          onSuccess: (data) => {
            console.log({ data });
            setSelectedExercises([]);

            if (shouldRedirect) {
              router.push(
                `/sessions/${sessionId}/tasks/${data.workout_task_id}`
              );
            } else {
              setIsOpen(false);
            }
          },
        }
      );
    } else {
      setSelectedExercises((prevSelectedExercises) => {
        if (prevSelectedExercises.includes(exerciseId)) {
          return prevSelectedExercises.filter((id) => id !== exerciseId);
        } else {
          return [...prevSelectedExercises, exerciseId];
        }
      });
    }
  };

  const handleExerciseSubmission = () => {
    const sessionId = data.session.session_id;
    mutate(
      { workoutId: data.session.workout_id, exerciseIds: selectedExercises },
      {
        onSuccess: (data) => {
          console.log({ data });
          setSelectedExercises([]);
          if (shouldRedirect) {
            router.push(`/sessions/${sessionId}/tasks/${data.workout_task_id}`);
          } else {
            setIsOpen(false);
          }
        },
      }
    );
  };

  /**
   * Flattens exerciseIds nested within exercises in tasks.
   * Used to filter out exercises that have already been added to the session.
   */
  const flattenedExerciseIds = data.session.tasks.reduce(
    (acc, task) => [
      ...acc,
      ...task.exercises.map((exercise) => exercise.exercise_id),
    ],
    [] as string[]
  );

  return (
    <div className="flex justify-center">
      <div className="flex w-full space-x-2">
        <button
          className={`w-full py-2 px-4 text-sm font-medium bg-slate-600 rounded-md focus:z-10 focus:ring-1 focus:ring-green-300 `}
          onClick={() => setIsOpen(true)}
        >
          Add Exercise
        </button>

        <button
          className={`w-full py-2 px-4 text-sm font-medium bg-slate-600 rounded-md focus:z-10 focus:ring-1 focus:ring-green-300 `}
          onClick={() => setIsOpen(true)}
        >
          Add Cardio
        </button>
      </div>

      <FullPageModal
        isOpen={isOpen}
        closeModal={() => {
          setSelectedExercises([]);
          setIsOpen(false);
        }}
      >
        <div className="sticky top-0 bg-slate-900 text-white z-50 ">
          <div className="flex justify-start">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white mt-2 text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow"
            >
              {isFilterOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-0 right-0 p-3"
          >
            <BiX className="h-6 w-6" />
          </button>

          <div className="pt-2 w-full">
            {isFilterOpen && (
              <FilterExercises
                setSortBy={setSortBy}
                setCategory={setCategory}
                setView={setView}
                setProfile={setProfile}
              />
            )}
          </div>
          <Input
            onChange={handleQuery}
            value={query}
            type="search"
            label={'search'}
          />
          <div className="pb-2 w-full">
            <CreateExercise />
          </div>
        </div>

        <SelectableExerciseList
          query={query}
          category={category}
          view={view}
          profile={profile}
          sortBy={sortBy}
          exerciseIds={flattenedExerciseIds}
          handleExerciseSelection={handleExerciseSelection}
          isLoading={isLoading}
          selectedExercises={selectedExercises}
          setSelectedExercises={setSelectedExercises}
          handleExerciseSubmission={handleExerciseSubmission}
        />
        <div className="h-20" />
      </FullPageModal>
    </div>
  );
};
