-- Given a workout id, return the workout
-- join the "setgroups" table using "workout"."id" = "setgroups"."workout_id"
-- join the "sets" table using "setgroups"."id" = "sets"."setgroup_id"
-- join the "exercises" table using "setgroup"."exercise_id" = "exercises"."id"
-- @param workoutId: the id of the workout
-- @return: the workout

SELECT w.done AS "workout_done",
       w.archived AS "workout_archived",
       sg.order AS "setgroup_order",
       sg.archived AS "setgroup_archived",
       e.name AS "exercise",
       s.weight AS "set_weight",
       s.reps AS "set_reps",
       s.done AS "set_done",
       s.archived AS "set_archived"
FROM api.workouts w
JOIN api.setgroups sg ON w.id = sg.workout_id
JOIN api.sets s ON sg.id = s.setgroup_id
JOIN api.exercises e ON sg.exercise_id = e.id
WHERE w.id = [workout_id]
ORDER BY sg.order ASC;

-- Given a workout id, return the workout
-- join the "setgroups" table using "workouts"."id" = "setgroups"."workout_id"
-- join the "sets" table using "setgroups"."id" = "sets"."setgroup_id"
-- join the "exercises" table using "setgroup"."exercise_id" = "exercises"."id"
-- @param workoutId: the id of the workout
-- @return: the workout

-- Given a workout id, return the workout
-- join the "setgroups" table using "workout"."id" = "setgroups"."workout_id"
-- join the "sets" table using "setgroups"."id" = "sets"."setgroup_id"
-- join the "exercises" table using "setgroup"."exercise_id" = "exercises"."id"
-- @param workoutId: the id of the workout
-- @return: the workout

SELECT w.done AS "workout_done",
       w.archived AS "workout_archived",
       sg.order AS "setgroup_order",
       sg.archived AS "setgroup_archived",
       e.name AS "exercise",
       s.weight AS "set_weight",
       s.reps AS "set_reps",
       s.done AS "set_done",
       s.archived AS "set_archived"
FROM api.workouts w
JOIN api.setgroups sg ON w.id = sg.workout_id
JOIN api.sets s ON sg.id = s.setgroup_id
JOIN api.exercises e ON sg.exercise_id = e.id
WHERE w.id = [workout_id]
ORDER BY sg.order ASC;

SELECT w.done      AS "workout_done", 
       w.archived  AS "workout_archived", 
       sg.order    AS "setgroup_order", 
       sg.archived AS "setgroup_archived", 
       e.name      AS "exercise", 
       s.weight    AS "set_weight", 
       s.reps      AS "set_reps", 
       s.done      AS "set_done", 
       s.archived  AS "set_archived" 
FROM   api.workouts w 
       JOIN api.setgroups sg 
         ON w.id = sg.workout_id 
       JOIN api.sets s 
         ON sg.id = s.setgroup_id 
       JOIN api.exercises e 
         ON sg.exercise_id = e.id 
WHERE  w.id = [workout_id]
ORDER  BY sg.order ASC; 