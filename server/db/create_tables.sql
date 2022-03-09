CREATE TABLE IF NOT EXISTS workouts (
    workout_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(30) NOT NULL,
    description text,
    category character varying(30),
    created_by bigint
);

CREATE TABLE IF NOT EXISTS exercises (
    exercise_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(30) NOT NULL,
    description text,
    category character varying(30),
    image text,
    video text,
    movement character varying(30),
    range character varying(30),
    created_by bigint
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_id bigint REFERENCES workouts(workout_id) ON DELETE CASCADE,
    exercise_id bigint REFERENCES exercises(exercise_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS muscle_groups (
    muscle_group_id bigserial PRIMARY KEY,
    name character varying(30) NOT NULL,
    description text,
    image text
);

CREATE TABLE IF NOT EXISTS exercise_muscle_groups (
    "group" character varying(30),
    muscle_group_id bigint REFERENCES muscle_groups(muscle_group_id),
    exercise_id bigint REFERENCES exercises(exercise_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sets (
    set_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    repetitions int DEFAULT 0,
    weight int DEFAULT 0,
    workout_id bigint REFERENCES workouts(workout_id) ON DELETE CASCADE,
    exercise_id bigint REFERENCES exercises(exercise_id)
);