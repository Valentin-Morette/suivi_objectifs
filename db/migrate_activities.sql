-- Met à jour les activités : retire yoga, natation, course
-- Ajoute course_tapis, course_exterieur
-- Recrée la table sessions (données effacées)

DROP TABLE IF EXISTS sessions;

CREATE TABLE sessions (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  goal_id     VARCHAR(64)  NOT NULL,
  `date`      DATE         NOT NULL,
  activity    ENUM('badminton', 'muscu', 'course', 'velo') NOT NULL,
  note        TEXT,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_goal
    FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_goal_date ON sessions (goal_id, `date` DESC);
