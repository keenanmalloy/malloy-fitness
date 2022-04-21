CREATE TABLE IF NOT EXISTS workouts (
    workout_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,

    -- What's the difference between started_at and workout_dt?
    -- started_at gets saved when the user begins their workout.
    -- workout_dt is a datetime that can be set in the future by the user. 
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    workout_dt timestamp with time zone,

    completed boolean default false NOT NULL,

    name text,
    description text,
    category character varying(30),
    created_by bigint
);

CREATE TABLE IF NOT EXISTS exercises (
    exercise_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,

    -- Can be of either 'public' | 'private'
    -- Public view means anyone can see the exercise / view the exercise
    -- Private view means only the user who created the exercise can view the exercise
    view text DEFAULT 'private',
    name text,
    description text,
    category character varying(30),
    video text,
    profile character varying(30),
    created_by bigint
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_exercise_id bigserial PRIMARY KEY,
    workout_id bigint REFERENCES workouts(workout_id) ON DELETE CASCADE,
    exercise_id bigint REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    priority int DEFAULT 1,
    "order" int DEFAULT 1,
    notes text,
    sets text,
    repetitions text,
    reps_in_reserve text,
    rest_period text,
    UNIQUE (workout_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS muscle_groups (
    muscle_group_id bigserial PRIMARY KEY,
    name text,
    description text,
    image text
);

CREATE TABLE IF NOT EXISTS exercise_muscle_groups (
    "group" character varying(30), -- primary || secondary
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
    exercise_id bigint REFERENCES exercises(exercise_id),
    set_order int DEFAULT 1
);

CREATE TABLE IF NOT EXISTS rest_periods (
    rest_period_id bigserial PRIMARY KEY,
    set_id bigint REFERENCES sets(set_id) ON DELETE CASCADE,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone
);


CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS accounts (
    account_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    given_name text,
    family_name text,
    name text,
    email text,
    active boolean DEFAULT false,
    avatar_url text,
    role text,
    ticket uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ticket_expiry timestamp with time zone DEFAULT now() NOT NULL,
    description text,
    phone text,
    locale VARCHAR(5) DEFAULT 'en-CA'
);

CREATE TABLE IF NOT EXISTS sleep (
    sleep_id bigserial PRIMARY KEY,
    account_id bigint,
    duration int,
    rating int,
    quality int,
    logged_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


CREATE TABLE IF NOT EXISTS account_providers (
    account_provider_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    account_id bigint REFERENCES accounts(account_id) ON DELETE CASCADE,
    auth_provider text,
    auth_provider_unique_id text
);

-- Create dummy user
INSERT INTO accounts (account_id, created_at, updated_at, name, email, active, avatar_url, role, ticket, ticket_expiry, locale) VALUES (1, '2022-03-25 14:57:10.384907', '2022-03-25 14:57:10.384907', 'tester', 'tester@malloyfit.ca', false, null, null, '37f879ec-7b9b-40a9-97a3-5266d9653ea4', '2022-03-25 14:57:10.384907', 'ca');

-- Create dummy workouts
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1000, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 1', 'Description of a workout 1', 'test', 1, '2022-03-25 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1001, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 2', 'Description of a workout 2', 'test', 1, '2022-03-26 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1002, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 3', 'Description of a workout3 ', 'test', 1, '2022-03-27 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1003, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 4', 'Description of a workout 4', 'test', 2, '2022-03-28 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1004, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 5', 'Description of a workout 5', 'test', 2, '2022-03-29 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1005, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 6', 'Description of a workout 6', 'test', 2, '2022-03-30 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1006, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 7', 'Description of a workout 7', 'test', null, '2022-03-31 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1007, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 8', 'Description of a workout 8', 'test', null, '2022-04-01 15:31:45.499581');
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by, workout_dt) VALUES (1008, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 9', 'Description of a workout 9', 'test', null, '2022-04-02 15:31:45.499581');

-- Create dummy exercises
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1000, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 1', 'Description of an exercise', 'test', null, 'test', 1);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1001, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 2', 'Description of an exercise', 'test', null, 'test', 1);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1002, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 3', 'Description of an exercise', 'test', null, 'test', 1);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1003, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 4', 'Description of an exercise', 'test', null, 'test', 2);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1004, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 5', 'Description of an exercise', 'test', null, 'test', 2);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1005, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 6', 'Description of an exercise', 'test', null, 'test', 2);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1006, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 7', 'Description of an exercise', 'test', null, 'test', null);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1007, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 8', 'Description of an exercise', 'test', null, 'test', null);
INSERT INTO exercises (exercise_id, created_at, updated_at, name, description, category, video, profile, created_by) VALUES (1008, '2022-03-25 15:09:07.004811', '2022-03-25 15:09:07.004811', 'Test exercise 9', 'Description of an exercise', 'test', null, 'test', null);

-- Create dummy muscle-groups
INSERT INTO public.muscle_groups (muscle_group_id, name, description, image) VALUES (1000, 'Muscle Group 1', 'Description of muscle group 1', null);
INSERT INTO public.muscle_groups (muscle_group_id, name, description, image) VALUES (1001, 'Muscle Group 2', 'Description of muscle group 2', null);
INSERT INTO public.muscle_groups (muscle_group_id, name, description, image) VALUES (1002, 'Muscle Group 3', 'Description of muscle group 3', null);
INSERT INTO public.muscle_groups (muscle_group_id, name, description, image) VALUES (1003, 'Muscle Group 4', 'Description of muscle group 4', null);
INSERT INTO public.muscle_groups (muscle_group_id, name, description, image) VALUES (1004, 'Muscle Group 5', 'Description of muscle group 5', null);
INSERT INTO public.muscle_groups (muscle_group_id, name, description, image) VALUES (1005, 'Muscle Group 6', 'Description of muscle group 6', null);