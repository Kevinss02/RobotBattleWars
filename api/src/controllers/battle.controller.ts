/* eslint-disable @typescript-eslint/naming-convention */
import { Request, Response } from 'express';

import { Battle } from '../entities/battle.entity.js';
import { BattleKind } from '../entities/battlekind.entity.js';
import { Place } from '../entities/place.entity.js';
import { Team } from '../entities/team.entity.js';
import { battleSchema } from '../schemas/battle.schema.js';
import {
  BattleFilters,
  BattleResponse,
  BattleType,
} from '../utils/types/types.js';

export const getBattles = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { battle_id, team_id1, team_id2, type_id, date, place_id } =
      req.query;

    const filters: BattleFilters = {};

    if (battle_id !== undefined) {
      filters.battle_id = parseInt(battle_id as string);
    }

    if (team_id1 !== undefined) {
      filters.team_id1 = parseInt(team_id1 as string);
    }

    if (team_id2 !== undefined) {
      filters.team_id2 = parseInt(team_id2 as string);
    }

    if (type_id !== undefined) {
      filters.type_id = parseInt(type_id as string);
    }

    if (date !== undefined) {
      filters.date = new Date(date as string);
    }

    if (place_id !== undefined) {
      filters.place_id = parseInt(place_id as string);
    }

    const battles: BattleResponse[] = await Battle.find({
      where: filters,
      relations: ['team_id1', 'team_id2', 'type_id', 'place_id'],
    });

    if (battles.length > 0) {
      res.status(200).json({ battles });
    } else {
      res.status(404).json({ error: 'Battles not found' });
    }
  } catch (error) {
    console.error('Error while retrieving battles:', error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const registerBattle = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {

    req.body.date = new Date(req.body.date)


    const validatedData = battleSchema.parse(req.body);

    const { team_id1, team_id2, type_id, date, place_id }: BattleType =
      validatedData;

    const battle = new Battle();

    const existingTeam1 = await Team.findOne({
      where: { team_id: team_id1 },
      relations: ['robot_id'],
    });

    if (existingTeam1 == null) {
      res.status(400).json({ error: 'Team 1 not found' });
      return;
    }

    if (existingTeam1.robot_id === null) {
      res.status(400).json({ error: 'The team 1 must have a robot' });
      return;
    }

    const existingTeam2 = await Team.findOne({
      where: { team_id: team_id2 },
      relations: ['robot_id'],
    });

    if (existingTeam2 == null) {
      res.status(400).json({ error: 'Team 2 not found' });
      return;
    }

    if (existingTeam2.robot_id === null) {
      res.status(400).json({ error: 'The team 2 must have a robot' });
      return;
    }

    battle.team_id1 = team_id1;
    battle.team_id2 = team_id2;
    battle.type_id = type_id;
    battle.date = date;
    battle.place_id = place_id;

    const type = await BattleKind.findOneBy({ type_id });

    if (type === null) {
      res.status(400).json({ error: 'Invalid Battle Kind' });
      return;
    }

    const place = await Place.findOneBy({ place_id });

    if (place === null) {
      res.status(400).json({ error: 'Place not found' });
      return;
    }

    if (team_id1 === team_id2) {
      res.status(400).json({ error: 'The teams must be different' });
      return;
    }

    await battle.save();

    res.status(201).json({ battle });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deleteBattle = async function (
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { id } = req.params;

    if (id == null) {
      res.status(400).json({ error: 'Parameter "id" is required' });
      return;
    }
    const result = await Battle.delete({ battle_id: parseInt(id) });

    if (result.affected === 0) {
      res.status(404).json({ error: 'Battle not found' });
      return;
    }

    res.status(204).json({ message: 'Succesful deleted' });
  } catch (error) {
    console.error('Error while deleting battle:', error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ error: 'Internal server error', message: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
