CREATE TABLE IF NOT EXISTS exercises (
    exercise_id bigserial PRIMARY KEY,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(30) NOT NULL, 
    description text,
    category character varying(30),
    "primary" character varying(30),
    secondary character varying(30),
    image text,
    video text,
    movement character varying(30),
    created_by bigint
);