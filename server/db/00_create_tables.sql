CREATE TABLE IF NOT EXISTS workouts (
    workout_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    description text,
    category character varying(30),
    type text, 
    
    -- Can be of either 'public' | 'private'
    -- Public view means anyone can see the exercise / view the exercise
    -- Private view means only the user who created the exercise can view the exercise
    view text DEFAULT 'private',
    created_by bigint
);

CREATE TABLE IF NOT EXISTS sessions (
    session_id bigserial PRIMARY KEY,
    workout_id bigint NOT NULL REFERENCES workouts(workout_id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    started_at timestamp with time zone,
    ended_at timestamp with time zone,
    session_dt timestamp with time zone,
    completed boolean default false NOT NULL,
    deload boolean default false NOT NULL,
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
    session_id bigint REFERENCES sessions(session_id) ON DELETE CASCADE,
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