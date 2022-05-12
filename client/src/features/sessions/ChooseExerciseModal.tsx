import { CreateExercise } from 'features/exercises/components/CreateExercise';
import { FilterExercises } from 'features/exercises/components/FilterExercises';
import { Input } from 'features/form/Input';
import FullPageModal from 'features/modal/FullPageModal';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { BiX } from 'react-icons/bi';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { SelectableExerciseList } from './SelectableExercistList';
import { SessionSummaryResponse } from './types';
import { useAddExerciseToSessionMutation } from './useAddExerciseToSession';

interface ChooseExerciseModalProps {
  data: SessionSummaryResponse;
  shouldRedirect?: boolean;
}

export const ChooseExerciseModal = ({
  data,
  shouldRedirect,
}: ChooseExerciseModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [view, setView] = useState('');
  const [profile, setProfile] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const router = useRouter();

  const { mutate, isLoading, isError } = useAddExerciseToSessionMutation(
    data.session.session_id
  );

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleExerciseSelection = (exerciseId: string) => {
    const sessionId = data.session.session_id;
    mutate(
      { workoutId: data.session.workout_id, exerciseId: exerciseId },
      {
        onSuccess: () => {
          if (shouldRedirect) {
            router.push(`/sessions/${sessionId}/exercises/${exerciseId}`);
          } else {
            setIsOpen(false);
          }
        },
      }
    );
  };

  return (
    <div className="flex justify-center">
      <div className="flex px-5 w-full">
        <button
          className={`w-full py-2 px-4 text-sm font-medium bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-1 focus:ring-green-300 focus:text-green-700`}
          onClick={() => setIsOpen(true)}
        >
          Add Exercise
        </button>

        <button
          className={`w-full py-2 px-4 text-sm font-medium bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:text-green-700 focus:z-10 focus:ring-1 focus:ring-green-300 focus:text-green-700`}
          onClick={() => setIsOpen(true)}
        >
          Add Cardio
        </button>
      </div>

      <FullPageModal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <div className="sticky top-0 bg-white z-50">
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
          exercises={data.session.exercises}
          handleExerciseSelection={handleExerciseSelection}
        />
        <div className="h-20" />
      </FullPageModal>
    </div>
  );
};
