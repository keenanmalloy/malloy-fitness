CREATE TABLE IF NOT EXISTS workouts (
    workout_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    description text,
    category character varying(30),
    created_by bigint
);

CREATE TABLE IF NOT EXISTS exercises (
    exercise_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    description text,
    category character varying(30),
    video text,
    profile character varying(30),
    created_by bigint
);

CREATE TABLE IF NOT EXISTS workout_exercises (
    workout_id bigint REFERENCES workouts(workout_id) ON DELETE CASCADE,
    exercise_id bigint REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    priority int DEFAULT 0,
    "order" int DEFAULT 0,
    PRIMARY KEY (workout_id, exercise_id)
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
    exercise_id bigint REFERENCES exercises(exercise_id)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS accounts (
    account_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    email text,
    active boolean DEFAULT false,
    avatar_url text,
    role text,
    ticket uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ticket_expiry timestamp with time zone DEFAULT now() NOT NULL,
    locale VARCHAR(2) DEFAULT 'en-CA'
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
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1000, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 1', 'Description of a workout 1', 'test', 1);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1001, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 2', 'Description of a workout 2', 'test', 1);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1002, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 3', 'Description of a workout3 ', 'test', 1);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1003, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 4', 'Description of a workout 4', 'test', 2);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1004, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 5', 'Description of a workout 5', 'test', 2);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1005, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 6', 'Description of a workout 6', 'test', 2);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1006, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 7', 'Description of a workout 7', 'test', null);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1007, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 8', 'Description of a workout 8', 'test', null);
INSERT INTO workouts (workout_id, created_at, updated_at, name, description, category, created_by) VALUES (1008, '2022-03-25 15:31:45.499581', '2022-03-25 15:31:45.499581', 'Test workout 9', 'Description of a workout 9', 'test', null);

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