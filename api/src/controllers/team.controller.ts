/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';

import { Robot } from '../entities/robot.entity.js';
import { Team } from '../entities/team.entity.js';
import { optionalTeamSchema, teamSchema } from '../schemas/team.schema.js';
import { TeamFilters, TeamResponse, TeamType } from '../utils/types/types.js';

export const getTeams = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { team_id, name, robot_id } = req.query;

    const filters: TeamFilters = {};

    if (team_id !== undefined) {
      filters.team_id = parseInt(team_id as string);
    }

    if (name !== undefined) {
      filters.name = name as string;
    }

    if (robot_id !== undefined) {
      filters.robot_id = parseInt(robot_id as string);
    }

    const teams: TeamResponse[] = await Team.find({
      where: filters,
      relations: ['robot_id'],
    });

    if (teams.length > 0) {
      res.status(200).json({ teams });
    } else {
      res.status(404).json({ error: 'Teams not found' });
    }
  } catch (error) {
    console.error('Error while retrieving teams:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const registerTeam = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const validatedData = teamSchema.parse(req.body);

    const { name, robot_id }: TeamType = validatedData;

    const team = new Team();

    const existingTeam = await Team.findOneBy({ name });

    if (existingTeam != null) {
      res
        .status(400)
        .json({ error: 'A team with the same name already exists' });

      return;
    }

    team.name = name;

    if (robot_id !== undefined) {
      const existingRobot = await Robot.findOneBy({ robot_id });
      if (existingRobot == null) {
        res.status(404).json({ error: 'Robot id not found' });

        return;
      }

      const existingTeamRobot = await Team.findOneBy({ robot_id });

      if (existingTeamRobot != null) {
        res
          .status(400)
          .json({ error: 'A team with the specified robot already exists' });

        return;
      }

      team.robot_id = robot_id;
    }

    await team.save();
    res.status(201).json({ registered: team });
  } catch (error) {
    console.error('Error while registering team:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteTeam = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
      return;
    }

    const result = await Team.delete({ team_id: parseInt(id) });

    if (result.affected === 0) {
      res.status(404).json({ message: 'Team not found' });
      return;
    }

    res.status(204).json('Succesful detele');
  } catch (error) {
    console.error('Error while deleting team:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updateTeam = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
      return;
    }

    const existingTeam = await Team.findOne({
      where: {
        team_id: parseInt(id),
      },
    });

    if (existingTeam == null) {
      res.status(404).json({ error: 'Team not found' });
      return;
    }

    const updatedTeamData = optionalTeamSchema.parse(req.body);
    const { name, robot_id }: TeamFilters = updatedTeamData;

    if (name !== undefined) {
      existingTeam.name = name;
    }

    if (robot_id !== undefined) {
      const existingRobot = await Robot.findOneBy({ robot_id });
      if (existingRobot == null) {
        res.status(404).json({ error: 'Robot id not found' });
        return;
      }

      const existingTeamRobot = await Team.findOneBy({ robot_id });

      if (existingTeamRobot != null) {
        res
          .status(400)
          .json({ error: 'A team with the specified robot already exists' });

        return;
      }

      existingTeam.robot_id = robot_id;
    }

    await existingTeam.save();
    res.status(200).json({ updated: existingTeam });
  } catch (error) {
    console.error('Error while updating team:', error);

    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
