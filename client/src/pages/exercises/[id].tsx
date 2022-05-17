import React from 'react';
import { GetSingleExercise } from 'features/exercises/components/GetSingleExercise';
import Layout from 'features/common/Layout';
import { GetStaticPropsContext } from 'next';
import { useRouter } from 'next/router';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const exerciseId = params && params.id;

  return {
    props: { exerciseId },
  };
}
interface Props {
  exerciseId: string;
}
const ExercisePage = ({ exerciseId }: Props) => {
  const router = useRouter();

  return (
    <Layout>
      <header className="flex justify-between p-5 items-center">
        <h1 className="text-2xl">Exercise</h1>
        <div>
          <button
            className="bg-slate-700 text-white font-semibold py-2 px-6 rounded shadow"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </header>
      <GetSingleExercise id={exerciseId} />
    </Layout>
  );
};

export default ExercisePage;
