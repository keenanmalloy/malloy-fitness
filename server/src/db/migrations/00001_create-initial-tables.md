```sql
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
    primary_tracker character varying(30),
    secondary_tracker character varying(30),
    type text, -- hypertrophy, strength, cardio, physiotherapy
    created_by bigint
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

CREATE TABLE IF NOT EXISTS workouts (
    workout_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name text,
    description text,
    category character varying(30),
    type text,
    task_order jsonb, -- [1, 2, 3, 4, 5] // list of workout_task_id's in order

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
    readiness_energy integer,
    readiness_mood integer,
    readiness_stress integer,
    readiness_soreness integer,
    readiness_sleep integer,
    name text,
    created_by bigint
);

CREATE TABLE IF NOT EXISTS exercise_notes (
    exercise_note_id bigserial PRIMARY KEY,
    session_id bigint NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    exercise_id bigint NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,

    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,

    notes text,
    video text,
    image text
);

-- We use this table to link /sessions/:session_id/task/:workout_task_id
-- This is so we can have supersets of exercises in a session
CREATE TABLE IF NOT EXISTS workout_tasks (
    workout_task_id bigserial PRIMARY KEY,
    exercise_order jsonb, -- [1, 2, 3, 4, 5] // list of exercise_id's in order
    workout_id bigint NOT NULL REFERENCES workouts(workout_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS workout_task_exercises (
    workout_task_exercise_id bigserial PRIMARY KEY,
    workout_task_id bigint NOT NULL REFERENCES workout_tasks(workout_task_id) ON DELETE CASCADE,
    exercise_id bigint NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
    workout_id bigint NOT NULL REFERENCES workouts(workout_id) ON DELETE CASCADE,

    -- metadata to show instructions to the user
    -- ex reps 2, sets 3, rest 2minutes, 2RIR
    sets text,
    repetitions text,
    reps_in_reserve text,
    rest_period text,

    UNIQUE (workout_id, exercise_id)
);

CREATE TABLE IF NOT EXISTS sets (
    set_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    repetitions int DEFAULT 0,
    weight int DEFAULT 0,
    session_id bigint REFERENCES sessions(session_id) ON DELETE CASCADE,
    exercise_id bigint REFERENCES exercises(exercise_id)
);

CREATE TABLE IF NOT EXISTS rest_periods (
    rest_period_id bigserial PRIMARY KEY,
    set_id bigint REFERENCES sets(set_id) ON DELETE CASCADE,
    seconds int DEFAULT 0
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
    locale VARCHAR(5) DEFAULT 'en-CA',
    gender text DEFAULT 'prefer not to say',
    dob timestamp with time zone,
    weight int,
    height int,
    country VARCHAR(2) DEFAULT 'CA',
    city text
);

CREATE TABLE IF NOT EXISTS settings (
    setting_id bigserial PRIMARY KEY,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    account_id bigint,
    unit_preference text DEFAULT 'imperial', -- imperial | metric
    appearance text DEFAULT 'light', -- light | dark

    -- goals
    daily_steps_goal int DEFAULT 5000,
    weekly_cardio_minutes_goal int DEFAULT 150,
    body_weight_goal int
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
```
