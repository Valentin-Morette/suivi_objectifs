-- Schéma MySQL — page Sport (objectif hebdomadaire + séances)

CREATE TABLE goals (
  id                VARCHAR(64)  NOT NULL PRIMARY KEY,
  label             VARCHAR(255) NOT NULL,
  description       TEXT,
  target_per_week   INT          NOT NULL CHECK (target_per_week > 0),
  unit              VARCHAR(64)  NOT NULL DEFAULT 'séances',
  created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  goal_id     VARCHAR(64)  NOT NULL,
  `date`      DATE         NOT NULL,
  activity    ENUM('badminton', 'muscu', 'course', 'velo', 'renforcement', 'natation', 'rando') NOT NULL,
  note        TEXT,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_goal
    FOREIGN KEY (goal_id) REFERENCES goals (id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_goal_date ON sessions (goal_id, `date` DESC);

-- Courses / trails réalisés (compétitions)
CREATE TABLE races (
  id                INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  type              ENUM('course', 'trail') NOT NULL,
  name              VARCHAR(255) NOT NULL,
  `date`            DATE NOT NULL,
  duration_seconds  INT UNSIGNED NOT NULL,
  distance_km       DECIMAL(6, 2) NOT NULL,
  elevation_m       INT UNSIGNED NULL,
  position          VARCHAR(32) NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_races_date ON races (`date` DESC);

-- Historique quotidien abonnés YouTube / TikTok (1 ligne / jour / plateforme)
CREATE TABLE social_stats (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  platform      ENUM('youtube', 'tiktok') NOT NULL,
  handle        VARCHAR(64) NOT NULL,
  followers     INT UNSIGNED NOT NULL,
  recorded_on   DATE NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_social_platform_day (platform, recorded_on)
);

CREATE INDEX idx_social_stats_day ON social_stats (recorded_on DESC);

-- Objectif initial (page Sport)
INSERT INTO goals (id, label, description, target_per_week, unit)
VALUES (
  'sport',
  'Sport',
  '3 séances par semaine, peu importe l''activité',
  3,
  'séances'
);
