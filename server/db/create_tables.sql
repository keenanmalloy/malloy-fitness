CREATE TABLE IF NOT EXISTS workouts (
    workout_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character TEXT NOT NULL,
    description text,
    category character varying(30),
    created_by bigint
);

CREATE TABLE IF NOT EXISTS exercises (
    exercise_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character TEXT NOT NULL,
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
    order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS muscle_groups (
    muscle_group_id bigserial PRIMARY KEY,
    name character TEXT NOT NULL,
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