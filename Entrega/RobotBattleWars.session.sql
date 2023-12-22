-- Creation of the robot table with subtypes Cutter, Hitter, and Flamethrower
CREATE TABLE robot (
    robot_id SERIAL PRIMARY KEY,
    mobility integer CHECK (mobility BETWEEN 1 AND 5) NOT NULL,
    power integer CHECK (power BETWEEN 1 AND 5) NOT NULL,
    name character varying(50) NOT NULL CHECK (name ~ '^[a-zA-Z0-9 ]+$'),
    coating integer CHECK (coating BETWEEN 1 AND 5) NOT NULL,
    cost DECIMAL(10, 2) CHECK (cost BETWEEN 1.0 AND 100000.0) NOT NULL,
    category character varying(20) NOT NULL,
    arm_material character varying(30) CHECK (arm_material ~ '^[a-zA-Z0-9 ]+$'),
    joint_count integer CHECK (joint_count BETWEEN 1 AND 6),
    hitting_surface integer CHECK (hitting_surface BETWEEN 1 AND 100),
    hitting_force integer CHECK (hitting_force BETWEEN 1 AND 2000),
    fuel character varying(20) CHECK (fuel ~ '^[a-zA-Z0-9 ]+$'),
    max_temperature integer CHECK (max_temperature BETWEEN 800 AND 2000),
    spitfire_count integer CHECK (spitfire_count BETWEEN 1 AND 5),
    rpm integer CHECK (rpm BETWEEN 500 AND 5000),
    saw_material character varying(30) CHECK (saw_material ~ '^[a-zA-Z0-9 ]+$'),
    saw_count integer CHECK (saw_count BETWEEN 1 AND 10),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE team (
    team_id SERIAL PRIMARY KEY,
    name character varying(100) CHECK (name ~ '^[a-zA-Z0-9 ]+$') NOT NULL,
    robot_id integer,
    FOREIGN KEY (robot_id) REFERENCES robot(robot_id),
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE member (
    dni character varying(9) PRIMARY KEY CHECK (dni ~ '^[0-9]{8}[A-Z]$'),
    fullname character varying(100) NOT NULL,
    email character varying CHECK (email ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$') NOT NULL UNIQUE,
    is_captain boolean DEFAULT false,
    team_id integer,
    password character(100) NOT NULL,
    FOREIGN KEY (team_id) REFERENCES Team(team_id),
    active boolean DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

-- Creation of the Place table
CREATE TABLE place (
    place_id SERIAL PRIMARY KEY,
    name character varying(50) CHECK (name ~ '^[a-zA-Z0-9 ]+$') NOT NULL,
    location character varying(50) CHECK (location ~ '^[a-zA-Z0-9 ]+$') NOT NULL,
    capacity integer CHECK (capacity > 0) NOT NULL
); 

-- Creation of the BattleKind table
CREATE TABLE battlekind (
    type_id SERIAL PRIMARY KEY,
    rounds integer CHECK (rounds BETWEEN 1 AND 30) NOT NULL,
    time_per_round integer CHECK (time_per_round BETWEEN 1 AND 15) NOT NULL,
    timeouts integer CHECK (timeouts BETWEEN 1 AND 10) NOT NULL,
    spontaneous boolean NOT NULL
);

-- Creation of the Battle table
CREATE TABLE battle (
    battle_id SERIAL PRIMARY KEY,
    team_id1 integer NOT NULL,
    team_id2 integer CHECK (team_id1 <> team_id2) NOT NULL,
    type_id integer NOT NULL,
    date DATE CHECK (date > CURRENT_DATE) NOT NULL,
    place_id integer NOT NULL,
    FOREIGN KEY (team_id1) REFERENCES Team(team_id) ON DELETE CASCADE,
    FOREIGN KEY (team_id2) REFERENCES Team(team_id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES BattleKind(type_id) ON DELETE CASCADE,
    FOREIGN KEY (place_id) REFERENCES Place(place_id) ON DELETE CASCADE
);

-- Insertions into the robot table 
INSERT INTO robot (mobility, power, name, coating, cost, arm_material, joint_count, hitting_surface, hitting_force, category)
VALUES (2, 4, 'Pulotoide', 3, 1000.0, 'iron', 4, 50, 1000, 'Hitter');

INSERT INTO robot (mobility, power, name, coating, cost, fuel, max_temperature, spitfire_count, category)
VALUES (3, 2, 'Flamigero', 2, 500.0, 'Gasolina', 1000, 3, 'Flamethrower');

INSERT INTO robot (mobility, power, name, coating, cost, rpm, saw_material, saw_count, category)
VALUES (1, 5, 'Sierra', 1, 2000.0, 1000, 'Acero', 10, 'Cutter');

-- Insertions into the Team table
INSERT INTO team (name, robot_id)
VALUES ('Team A', 1);
INSERT INTO team (name, robot_id)
VALUES ('Team B', 2);

-- Insertions into the Member table
INSERT INTO member (dni, fullname, email, is_captain, team_id, password)
VALUES ('12345678A', 'John Doe', 'aa@pepito.com', true, 1, '123456');
INSERT INTO member (dni, fullname, email, is_captain, team_id, password)
VALUES ('12345678B', 'John Cenatra', 'bb@pepito.com', true, 2, '123456');
INSERT INTO member (dni, fullname, email, is_captain, team_id, password)
VALUES ('12345678C', 'John Cena', 'cc@pepito.com', false, 1, '123456');
INSERT INTO member (dni, fullname, email, is_captain, team_id, password)
VALUES ('12345678D', 'John Desayuno', 'dd@pepito.com', false, 2, '123456');
INSERT INTO member (dni, fullname, email, is_captain, team_id, password)
VALUES ('12345678E', 'John Merienda', 'ee@pepito.com', false, 1, '123456');
INSERT INTO member (dni, fullname, email, is_captain, team_id, password)
VALUES ('12345678F', 'John Comida', 'ff@pepito.com', false, 2, '123456');

-- Insertions into the Place table
INSERT INTO place ( name, location, capacity)
VALUES ('Place A', 'Location A', 100);
INSERT INTO place ( name, location, capacity)
VALUES ('Place B', 'Location B', 100);

-- Insertions into the BattleKind table
INSERT INTO battleKind (rounds, time_per_round, timeouts, spontaneous)
VALUES (1, 1, 1, false);
INSERT INTO battleKind (rounds, time_per_round, timeouts, spontaneous)
VALUES (2, 2, 2, false);

-- Insertions into the Battle table
INSERT INTO battle (team_id1, team_id2, type_id, date, place_id)
VALUES (1, 2, 1, CURRENT_DATE + 1, 1);
INSERT INTO battle (team_id1, team_id2, type_id, date, place_id)
VALUES (1, 2, 2, CURRENT_DATE + 2, 2);

-- Function to check that a Team does not have more than 5 Members
CREATE OR REPLACE FUNCTION check_max_members_per_team() RETURNS TRIGGER AS $$ BEGIN IF (
        SELECT COUNT(*)
        FROM member
        WHERE team_id = NEW.team_id
    ) >= 5 THEN RAISE EXCEPTION 'A Team cannot have more than 5 Members.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---

CREATE TRIGGER before_insert_member BEFORE
INSERT ON Member FOR EACH ROW EXECUTE FUNCTION check_max_members_per_team();
---
-- Function to check that a user does not belong to two teams
CREATE OR REPLACE FUNCTION check_user_doesnt_belong_to_two_teams() RETURNS TRIGGER AS $$ BEGIN IF EXISTS (
        SELECT 1
        FROM member
        WHERE dni = NEW.dni
            AND team_id <> NEW.team_id
    ) THEN RAISE EXCEPTION 'The user already belongs to another Team.';
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

---
CREATE TRIGGER before_insert_team BEFORE
INSERT ON member FOR EACH ROW EXECUTE FUNCTION check_user_doesnt_belong_to_two_teams();

--- Solo puede haber un capitán por equipo
CREATE OR REPLACE FUNCTION check_only_one_captain_per_team() 
    RETURNS TRIGGER AS $$ BEGIN IF EXISTS (
            SELECT 1
            FROM member
            WHERE team_id = NEW.team_id
                AND is_captain = true
        ) THEN RAISE EXCEPTION 'There can only be one captain per team.';
    END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---

CREATE TRIGGER check_only_one_captain_per_team BEFORE
INSERT ON team FOR EACH ROW EXECUTE FUNCTION check_only_one_captain_per_team();


-- Updated at trigger for robot
CREATE OR REPLACE FUNCTION update_robot_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE TRIGGER before_update_robot BEFORE
UPDATE ON robot FOR EACH ROW EXECUTE FUNCTION update_robot_updated_at(); 

-- Updated at trigger for team
CREATE OR REPLACE FUNCTION update_team_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE TRIGGER before_update_team BEFORE
UPDATE ON team FOR EACH ROW EXECUTE FUNCTION update_team_updated_at();

-- Updated at trigger for member
CREATE OR REPLACE FUNCTION update_member_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
---
CREATE TRIGGER before_update_member BEFORE
UPDATE ON member FOR EACH ROW EXECUTE FUNCTION update_member_updated_at();

-- -- -- -- Borrar todas las tablas
    -- DROP SCHEMA public CASCADE;
    -- CREATE SCHEMA public;

-- SELECT * FROM cutter;
-- SELECT * FROM battle;
-- SELECT * FROM hitter

SELECT * FROM member;
